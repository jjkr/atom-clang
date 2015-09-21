'use babel';

import clangFlags from 'clang-flags';
import log from './log';
import libclang from './clang-ffi';

class ClangIndex {
  constructor() { this.init(); }

  init() {
    this._index = libclang.clang_createIndex(0, 0);
    this._translationUnits = {};
  }

  compile(buffer) {
    path = buffer.getPath();
    return this._doNewCompile(path);
    //    if (this._translationUnits[path]) {
    //      this._translationUnits[path]
    //    } else {
    //
    //    }
  }

  get translationUnits() { return this._translationUnits; }

  dispose() {
    for (tu of this._translationUnits) {
      libclang.clang_disposeTranslationUnit(this._translationUnits[tu]);
      delete this._translationUnits[tu];
    }
    libclang.clang_disposeIndex(this._index);
  }

  _doNewCompile(path) {
    return new Promise((resolve, reject) => {
      const flags = clangFlags.getClangFlags(path);
      libclang.clang_createTranslationUnitFromSourceFile.async(
        this._index, path, flags.length, flags, 0, 0, (err, res) => {
          log.debug('compiled ' + path);

          if (err) {
            log.error('error + ' + err);
            reject(err);
          } else {
            this._translationUnits[path] = res;
            resolve(res);
          }
        });
    });
  }
}

export default new ClangIndex();
