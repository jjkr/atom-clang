'use babel';

import log from './log';
import libclang from './clang-ffi';
import clangIndex from './clang-index';

function diagSeverityString(severity) {
  switch (severity) {
    case 0:
      return 'Ignored';
    case 1:
      return 'Note';
    case 2:
      return 'Warning';
    case 3:
      return 'Error';
    case 4:
      return 'Fatal';
    default:
      return 'Unknown';
  }
}

function getRangeFromDiag(diag) {
  //const numRanges = libclang.clang_getNumRanges(diag);
  const sourceRange = libclang.clang_getDiagnosticRange(diag, 0);
  const rangeStart = libclang.clang_getRangeStart(sourceRange);
  const rangeEnd = libclang.clang_getRangeEnd(sourceRange);
  return [[0, 0], [0, 1]];
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
        diags.map(d => {
          d.filePath = editor.getFilePath();
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

    for (let i = 0; i < size; i++) {
      const diag = libclang.clang_getDiagnosticInSet(diagSet, i);
      const severity = libclang.clang_getDiagnosticSeverity(diag);
      const messageText = libclang.clang_getDiagnosticSpelling(diag);

      lintDiags.join({
        type: diagSeverityString(severity),
        text: libclang.clang_getCString(messageText),
        range: getRangeFromDiag(diag)
      });

      libclang.clang_disposeString(messageText);
      libclang.clang_disposeDiagnostic(diag);
    }
    return lintDiags;
  }
}

export default Linter;
