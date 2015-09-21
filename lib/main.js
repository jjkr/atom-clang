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

export default main;
