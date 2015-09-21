'use babel';

import ref from 'ref';
import log from './log';
import libclang from './clang-ffi';
import clangIndex from './clang-index';

function diagSeverityString(severity) {
  switch (severity) {
    case 0:
    case 1:
      return 'Note';
    case 2:
      return 'Warning';
    case 3:
    case 4:
      return 'Error';
    default:
      return 'Unknown';
  }
}

function getSourceLocation(location) {
  const row = ref.alloc('uint');
  const column = ref.alloc('uint');
  libclang.clang_getSpellingLocation(location, ref.NULL, row, column, ref.NULL);
  return [row.deref() - 1, column.deref() - 1];
}

function getRangeFromDiag(diag) {
  const numRanges = libclang.clang_getDiagnosticNumRanges(diag);
  log.debug('got ' + numRanges + ' ranges');
  if (numRanges > 0) {
    const sourceRange = libclang.clang_getDiagnosticRange(diag, 0);
    const rangeStart = libclang.clang_getRangeStart(sourceRange);
    const rangeEnd = libclang.clang_getRangeEnd(sourceRange);
    return [getSourceLocation(rangeStart), getSourceLocation(rangeEnd)];
  } else {
    const location =
      getSourceLocation(libclang.clang_getDiagnosticLocation(diag));
    return [location, location];
  }
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
    const lintDiags = [];
    const diagSet = libclang.clang_getDiagnosticSetFromTU(tunit);
    const size = libclang.clang_getNumDiagnosticsInSet(diagSet);
    log.debug('got ' + size + ' diagnostics');

    for (let i = 0; i < size; i++) {
      const diag = libclang.clang_getDiagnosticInSet(diagSet, i);
      const severity = libclang.clang_getDiagnosticSeverity(diag);
      const messageText = libclang.clang_getDiagnosticSpelling(diag);
      log.debug('diag severity: ' + diagSeverityString(severity) + ' text: ' +
                libclang.clang_getCString(messageText));

      lintDiags.push({
        type: diagSeverityString(severity),
        text: libclang.clang_getCString(messageText),
        range: getRangeFromDiag(diag)
      });

      libclang.clang_disposeString(messageText);
      libclang.clang_disposeDiagnostic(diag);
    }
    log.debug('lintDiags: ' + lintDiags.toString());
    console.log(lintDiags);
    return lintDiags;
  }
}

export default Linter;
