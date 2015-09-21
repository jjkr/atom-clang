'use babel';

import ref from 'ref';
import log from './log';
import libclang from './clang-ffi';
import clangIndex from './clang-index';

function diagSeverityString(severity) {
  switch (severity) {
    case 0:
    case 1:
      return 'Trace';
    case 2:
      return 'Warning';
    case 3:
    case 4:
      return 'Error';
    default:
      return 'Unknown';
  }
}

function getSourceLocation(cxLocation) {
  const file = ref.alloc('pointer');
  const row = ref.alloc('uint');
  const column = ref.alloc('uint');
  libclang.clang_getSpellingLocation(cxLocation, file, row, column, ref.NULL);
  return {filePath: file.deref(), range: [row.deref() - 1, column.deref() - 1]};
}

function parseDiag(cxDiag) {
  const severity = libclang.clang_getDiagnosticSeverity(cxDiag);
  const messageText = libclang.clang_getDiagnosticSpelling(cxDiag);
  const message = {
    type: diagSeverityString(severity),
    text: libclang.clang_getCString(messageText)
  };
  const numRanges = libclang.clang_getDiagnosticNumRanges(cxDiag);
  log.debug('got ' + numRanges + ' ranges');
  if (numRanges > 0) {
    const sourceRange = libclang.clang_getDiagnosticRange(cxDiag, 0);
    const rangeStart =
      getSourceLocation(libclang.clang_getRangeStart(sourceRange));
    const rangeEnd = getSourceLocation(libclang.clang_getRangeEnd(sourceRange));
    message.filePath = rangeStart.filePath;
    message.range = [rangeStart.range, rangeEnd.range];
  } else {
    const location =
      getSourceLocation(libclang.clang_getDiagnosticLocation(cxDiag)).location;
    message.filePath = location.filePath;
    message.range = [location, location];
  }

  log.debug('diag severity: ' + diagSeverityString(severity) + ' text: ' +
            libclang.clang_getCString(messageText) + ' range: ' +
            range.toString());

  libclang.clang_disposeString(messageText);

  return message;
}

function parseDiagSet(diagSet, parseChildren) {
  const messages = [];
  const size = libclang.clang_getNumDiagnosticsInSet(diagSet);
  log.debug('got ' + size + ' diagnostics');

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
  log.debug('lintDiags: ' + lintDiags.toString());
  console.log(lintDiags);
  return lintDiags;
}

function getTraces(diagSet) {
  traces = [];
  const size = libclang.clang_getNumDiagnosticsInSet(diagSet);
  log.debug('traces size: ' + size);
  for (let i = 0; i < size; i++) {
    const diag = libclang.clang_getDiagnosticInSet(diagSet, i);
    const severity = libclang.clang_getDiagnosticSeverity(diag);
    const messageText = libclang.clang_getDiagnosticSpelling(diag);
    const location =
      getSourceLocation(libclang.clang_getDiagnosticLocation(diag));
    traces.push({
      type: 'Trace',
      text: libclang.clang_getCString(messageText),
      filePath: location.file,
      range: [location.location, location.location]
    });
    libclang.clang_disposeString(messageText);
    libclang.clang_disposeDiagnostic(diag);
  }
  return traces;
}

class Linter {
  constructor() {
    this.grammarScopes =
      ['source.c', 'source.cpp', 'source.objc', 'source.objcpp'];
    this.scope = 'file';
    this.lintOnFly = false;
  }

  lint(editor) {
    return clangIndex.compile(editor.buffer)
      .then(this._getDiags)
      .then(diags => {
        return diags.map(d => {
          d.filePath = editor.getPath();
          return d;
        });
      });
    //    return new Promise((resolve, reject) => {
    //      const messages = [{
    //        type: 'Error',
    //        text: 'Something went wrong',
    //        filePath: editor.getPath(),
    //        range: [[0, 0], [0, 1]]
    //      }];
    //      resolve(messages);
    //    });
  }

  _getDiags(tunit) {
    const diagSet = libclang.clang_getDiagnosticSetFromTU(tunit);
  }
}

export default Linter;
