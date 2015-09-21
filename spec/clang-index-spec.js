'use babel';

import clangIndex from '../lib/clang-index';

class MockTextBuffer {
  constructor(options) { this.path = options.path || './input/hello.cpp'; }
  getPath() { return this.path; }
}

describe('ClangIndex', () => {
  it('compiles translation units', () => {
    const buffer = new MockTextBuffer({});
    waitsForPromise(() => {
      return clangIndex.compile(buffer).then(tunit => {
        expect(tunit).toBeDefined();
        expect(tunit).not.toEqual(0);
      });
    });
  });
});
