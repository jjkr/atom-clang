'use babel';

import libclang from './clang-ffi';

class ClangIndex {
  constructor() {
    this._index = libclang.clang_createIndex(0, 0);
    this._translationUnits = {};
  }

  compile(buffer) {
    path = buffer.getPath();
    if (this._translationUnits[path]) {
      console.log('already compiled');
      // this._translationUnits[path]
    } else {
      libclang.clang_createTranslationUnitFromSourceFile.async(
        this._index, path, 0, 0, 0, 0, (err, res) => {
          log.info('compiled!');
          this._translationUnits[path] = res;
        });
    }
  }

  get translationUnits() { return this._translationUnits; }

  dispose() {
    for (tu of this._translationUnits) {
      libclang.clang_disposeTranslationUnit(tu);
    }
    libclang.clang_disposeIndex(this._index);
  }
}

export default new ClangIndex();
