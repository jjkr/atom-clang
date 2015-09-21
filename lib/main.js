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
    clangErrorLimit: {type: 'integer', default: 0}
  },

  activate: state => {
    log.info('activate atom-clang');
  },

  provideLinter: () => { return new Linter(); }
};

export default main;
