'use babel';

import libclang from './clang-ffi';

class AtomClang {
  activate(state) {
    this.clangIndex = libclang.clang_createIndex(0, 0);
    this.newEditorListener = atom.workspace.observeTextEditors(editor => {
      editor.onDidStopChanging(
          () => {console.log('editor changed! ' + editor.getPath())});
    });
  }

  deactivate() {
    libclang.clang_disposeIndex(this.clangIndex);
    this.newEditorListener.dispose();
    console.log('atom-clang deactivate')
  }

  serialize() { console.log('serialize'); }

  toggle() { console.log('toggle'); }
}

export default new AtomClang();
