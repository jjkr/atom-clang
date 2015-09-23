'use babel';

import ref from 'ref';
import log from './log';
import { libclang, cxCompletionResult } from './clang-ffi';
import clangIndex from './clang-index';

function parseCompletions(comps) {
  const size = libclang.clang_codeCompleteGetNumDiagnostics(comps);
  log.debug('got ' + size + ' completions');

  const arr = comps.deref();
  for (let i = 0; i < size; ++i) {
    const resultStructSize = cxCompletionResult.size;
    const result = ref.get(arr, i * resultStructSize, cxCompletionResult);
    log.debug('cursorKind ' + result.cursorKind);
  }
}

class Completer {
  constructor() {
    this.selector = '.source.c, .source.cpp, .source.objc, .source.objcpp';

    // This will take priority over the default provider, which has a priority
    // of 0. `excludeLowerPriority` will suppress any providers with a lower
    // priority i.e. The default provider will be suppressed
    this.inclusionPriority = 1;
    this.excludeLowerPriority = true;
  }

  getSuggestions(options) {
    console.log('get suggestions');
    console.log(options);

    const editor = options.editor;
    const bufferPos = options.bufferPosition;

    const path = editor.getPath();
    const tunit = clangIndex.getTranslationUnit(path);

    const completions = tunit.then( tu => {
      return new Promise((resolve, reject) => {
        libclang.clang_codeCompleteAt.async(
          tu, path, bufferPos.row + 1, bufferPos.column + 1, ref.NULL, 0, 0,
          (err, res) => {
            log.debug('got completions for ' + path);
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(res);
            }
          }
        )
      })
    });

    return completions.then(comps => {
      const suggestions = parseCompletions(comps);
      libclang.clang_disposeCodeCompleteResults(comps);
      return suggestions;
    });
  }
}

export default Completer;