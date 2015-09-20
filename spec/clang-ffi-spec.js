'use babel';

import libclang from '../lib/clang-ffi';

describe('libclang', () => {
  it('should create an index', () => {
    const index = libclang.clang_createIndex(0, 0);
    expect(index).toBeDefined();
    expect(index).not.toEqual(0);
    libclang.clang_disposeIndex(index);
  });
  describe('translation unit operations', () => {
    let index;
    beforeEach(() => { index = libclang.clang_createIndex(0, 0); });
    afterEach(() => { libclang.clang_disposeIndex(index); });

    it('should compile a valid c++ file', () => {
      const tunit = libclang.clang_createTranslationUnitFromSourceFile(
          index, 'input/hello.cpp', 0, 0, 0, 0);
      expect(tunit).toBeDefined();
      expect(index).not.toEqual(0);
      libclang.clang_disposeTranslationUnit(tunit);
    });

    it('should diagnose an invalid c++ file', () => {
      const tunit = libclang.clang_createTranslationUnitFromSourceFile(
          index, 'input/deadbeef.cpp', 0, 0, 0, 0);
      expect(tunit).toBeDefined();
      expect(index).not.toEqual(0);
      const numDiags = libclang.clang_getNumDiagnostics(tunit);
      expect(numDiags).toBeGreaterThan(0);
      libclang.clang_disposeTranslationUnit(tunit);
    });
  });
});
