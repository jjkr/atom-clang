'use babel';

import log from './log';
import libclang from './clang-ffi';
import clangIndex from './clang-index';

class Completer {
  constructor() {
    this.selector = '.source.c .source.cpp .source.objc .source.objcpp';

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

    const path = editor.getPath();
    const cursorPos = editor.getCursorBufferPosition();

    const tunit = clangIndex.getTranslationUnit(path);

    const cxCompletions = libclang.clang_codeCompleteAt(
      tunit, path, cursorPos.row, cursorPos.column, 0, 0, 0);

    log.debug('got completions for ' + path);

    libclang.clang_disposeCodeCompleteResults(cxCompletions);
    
    return [];
  }
}

export default Completer;