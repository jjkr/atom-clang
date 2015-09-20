'use babel';

import libclang from '../lib/clang-ffi'

describe('libclang', () => {
  it('should create an index', () => {
    const index = libclang.clang_createIndex(0, 0);
    expect(index).toBeDefined();
    expect(index).not.toEqual(0);
    libclang.clang_disposeIndex(index);
  });
});
