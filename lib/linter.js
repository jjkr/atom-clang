'use babel';

//
// Linting compatible with atom Linter
// https://github.com/atom-community/linter/wiki/Linter-API
//

import ref from 'ref';
import log from './log';
import libclang from './clang-ffi';
import clangIndex from './clang-index';

function diagSeverityString(severity) {
  switch (severity) {
    case 0:
    case 1:
      return 'info';
    case 2:
      return 'warning';
    case 3:
    case 4:
      return 'error';
    default:
      return 'unknown';
  }
}

function getSourceLocation(cxLocation) {
  const file = ref.alloc('pointer');
  const row = ref.alloc('uint');
  const column = ref.alloc('uint');

  libclang.clang_getSpellingLocation(cxLocation, file, row, column, ref.NULL);

  const cxFileName = libclang.clang_getFileName(file.deref());
  const filePath = libclang.clang_getCString(cxFileName);
  libclang.clang_disposeString(cxFileName);

  return {filePath: filePath, location: [row.deref() - 1, column.deref() - 1]};
}

//
// Convert a libclang cxDiagnostic into a JSON message for atom Linter
//
function parseDiag(cxDiag) {
  const severity = libclang.clang_getDiagnosticSeverity(cxDiag);
  const messageText = libclang.clang_getDiagnosticSpelling(cxDiag);

  const message = {
    type: diagSeverityString(severity),
    text: libclang.clang_getCString(messageText)
  };

  const numRanges = libclang.clang_getDiagnosticNumRanges(cxDiag);

  if (numRanges > 0) {
    const sourceRange = libclang.clang_getDiagnosticRange(cxDiag, 0);
    const rangeStart =
      getSourceLocation(libclang.clang_getRangeStart(sourceRange));
    const rangeEnd = getSourceLocation(libclang.clang_getRangeEnd(sourceRange));

    const l = rangeEnd.location;
    let end;
    if (l[0] === -1 && l[1] === -1) {
      end = rangeStart.location;
    } else {
      end = l;
    }

    message.filePath = rangeStart.filePath;
    message.range = [rangeStart.location, end];
  }
  if (!message.filePath) {
    const location =
      getSourceLocation(libclang.clang_getDiagnosticLocation(cxDiag));

    message.filePath = location.filePath;
    message.range = [location.location, location.location];
  }

  log.debug('diag severity: ' + message.type + ', text: ' + message.text +
            ', range: ' + JSON.stringify(message.range) + ', file: ' +
            message.filePath);

  libclang.clang_disposeString(messageText);

  return message;
}

function parseDiagSet(diagSet, parseChildren) {
  const messages = [];
  const size = libclang.clang_getNumDiagnosticsInSet(diagSet);
  for (let i = 0; i < size; i++) {
    const diag = libclang.clang_getDiagnosticInSet(diagSet, i);

    const message = parseDiag(diag);
    if (parseChildren) {
      const children = libclang.clang_getChildDiagnostics(diag);
      message.trace = parseDiagSet(children, false);
    }

    messages.push(message);

    libclang.clang_disposeDiagnostic(diag);
  }
  return messages;
}

class Linter {
  constructor() {
    this.grammarScopes =
      ['source.c', 'source.cpp', 'source.objc', 'source.objcpp'];
    this.scope = 'file';
    this.lintOnFly = false;
  }

  lint(editor) {
    return clangIndex.compile(editor.buffer).then(this._getDiags);
  }

  _getDiags(tunit) {
    const diagSet = libclang.clang_getDiagnosticSetFromTU(tunit);
    const messages = parseDiagSet(diagSet, true);
    libclang.clang_disposeDiagnosticSet(diagSet);
    return messages;
  }
}

export default Linter;
