'use babel';

//
// Atom package main entry point
//

import log from './log';
import Linter from './linter';
import Completer from './completer';

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

  provide: () => { return new Completer(); },
  
  provideLinter: () => { return new Linter(); }
};

export default main;
