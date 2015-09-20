'use babel';

import ClangIndex from '../lib/clang-index';

describe('ClangIndex', () => {
  it('constructs', () => {
    const ci = new ClangIndex();
    ci.dispose();
  });
});
