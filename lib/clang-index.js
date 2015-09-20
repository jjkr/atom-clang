'use babel';

import libclang from './clang-ffi';

class ClangIndex {
  constructor() {
    this._index = libclang.clang_createIndex(0, 0);
  }

  dispose() {
    libclang.clang_disposeIndex(this._index);
  }
}
