'use babel';

class AtomClang {
  activate(state) {
    atom.workspace.observeTextEditors(editor => {
      console.log('observing editor...');
      console.log(editor.getPath());
    });

    console.log('starting atom-clang');
  }

  deactivate() { console.log('deactivate'); }

  serialize() { console.log('serialize'); }

  toggle() { console.log('toggle'); }
}

export default new AtomClang();
