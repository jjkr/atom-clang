'use babel';

class AtomClang {
  activate(state) {
    console.log('starting atom-clang');
    console.log(state);
  }

  deactivate() { console.log('deactivate'); }

  serialize() { console.log('serialize'); }

  toggle() { console.log('toggle'); }
}

export default new AtomClang();
