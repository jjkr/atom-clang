'use babel';

import clangFlags from 'clang-flags';
import log from './log';
import libclang from './clang-ffi';
import clangIndex from './clang-index';
import Linter from './linter';

log.info('starting atom-clang');

const main = {
  config: {
    libclangPath: {
      title: 'Path to libclang',
      type: 'string',
      default: 'clang'
    },
    clangIncludePaths: {type: 'array', default: ['.']},
    clangSuppressWarnings: {type: 'boolean', default: false},
    clangDefaultCFlags: {type: 'array', default: ['-Wall']},
    clangDefaultCppFlags: {type: 'array', default: ['-Wall', '-std=c++11']},
    clangDefaultObjCFlags: {type: 'array', default: []},
    clangDefaultObjCppFlags: {type: 'array', default: []},
    clangErrorLimit: {type: 'integer', default: 0},
    verboseDebug: {type: 'boolean', default: false}
  },

  activate: state => {
    log.info('activate atom-clang');
  },

  provideLinter: () => { return new Linter(); }
};

//class AtomClang {
//  activate(state) {
//    this._clangIndex = libclang.clang_createIndex(0, 0);
//    this._clangTranslationUnits = {};
//    this._newEditorListener = atom.workspace.observeTextEditors(
//      editor => { this._addBuffer(editor.buffer); });
//  }

//  deactivate() {
//    this._newEditorListener.dispose();
//    libclang.clang_disposeIndex(this._clangIndex);
//    for (tu of this._clangTranslationUnits) {
//      libclang.clang_disposeTranslationUnit(tu);
//    }
//    console.info('atom-clang deactivate')
//  }
//
//  serialize() { log.info('serialize'); }
//
//  toggle() { log.info('toggle'); }
//
//  _addBuffer(buffer) {
//    const path = buffer.getPath();
//    log.info('add buffer! ' + path);
//
//    if (!this._clangTranslationUnits[path]) {
//      this._clangTranslationUnits[path] =
//        libclang.clang_createTranslationUnitFromSourceFile.async(
//          this._clangIndex, path, 0, 0, 0, 0,
//          (err, res) => {log.info('compiled!')});
//    }
//
//    buffer.onDidStopChanging(() => {
//      log.info('buffer changed! ' + buffer.getPath());
//      log.info(buffer);
//    });
//
//    buffer.onDidSave(() => {
//      log.info('buffer saved! ' + buffer.getPath());
//      log.info(buffer);
//    });
//  }
//}

export default main;
