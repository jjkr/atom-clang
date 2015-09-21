'use babel';

import log from './log';
import clangIndex from './clang-index';

class Linter {
  constructor() {
    this.grammarScopes =
      ['source.c', 'source.cpp', 'source.objc', 'source.objcpp'];
    this.scope = 'file';
    this.lintOnFly = false;
  }

  lint(editor) {
    log.debug('Linting with clang!');
    console.log(editor);
    log.debug('FLAGS!');
    const tu = clangIndex.compile(editor.getPath());
    return new Promise((resolve, reject) => {
      const messages = [{
        type: 'Error',
        text: 'Something went wrong',
        filePath: editor.getPath(),
        range: [[0, 0], [0, 1]]
      }];
      resolve(messages);
    });
  }
}

export default Linter;
