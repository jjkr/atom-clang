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

  getTranslationUnit(path) {
    const tunit = this._translationUnits[path];
    if (tunit) {
      return new Promise(resolve => { resolve(tunit); });
    } else {
      return this._doNewCompile(path);
    }
  }

  compile(buffer) {
    path = buffer.getPath();
    const tunit = this._translationUnits[path];
    if (tunit) {
      return this._doReCompile(tunit);
    } else {
      return this._doNewCompile(path);
    }
  }

  get translationUnits() { return this._translationUnits; }

  dispose() {
    for (tu of this._translationUnits) {
      libclang.clang_disposeTranslationUnit(this._translationUnits[tu]);
      delete this._translationUnits[tu];
    }
    libclang.clang_disposeIndex(this._index);
  }

  _doReCompile(tunit) {

    return new Promise((resolve, reject) => {
      const flags = clangFlags.getClangFlags(path);
      const options = libclang.clang_defaultReparseOptions(tunit);
      libclang.clang_reparseTranslationUnit.async(
        tunit, 0, 0, options, (err, res) => {
          if (err) {
            log.error('error + ' + err);
            reject(err);
          } else if (res !== 0) {
            libclang.clang_disposeTranslationUnit(tunit);
            delete this._translationUnits[path];
            reject('failed to reparse: ' + res);
          } else {
            log.debug('recompiled ' + path);
            resolve(tunit);
          }
        });
    });
  }

  _doNewCompile(path) {
    return new Promise((resolve, reject) => {
      const flags = clangFlags.getClangFlags(path);
      const tunits = this._translationUnits;
      libclang.clang_parseTranslationUnit.async(
        this._index, path, flags, flags.length, 0, 0, 4, (err, res) => {
          if (err) {
            log.error('error + ' + err);
            reject(err);
          } else if (res === 0) {
            reject('failed to parse');
          } else {
            log.debug('compiled ' + path);
            tunits[path] = res;
            resolve(res);
          }
        });
    });
  }
}

export default new ClangIndex();
