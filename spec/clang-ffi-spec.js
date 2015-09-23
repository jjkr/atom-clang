'use babel';

import path from 'path';
import { libclang } from '../lib/clang-ffi';

describe('libclang', () => {
  describe('index operations', () => {
    it('should create an index', () => {
      const index = libclang.clang_createIndex(0, 0);
      expect(index).toBeDefined();
      expect(index).not.toEqual(0);
      libclang.clang_disposeIndex(index);
    });
  });

  describe('translation unit operations', () => {
    let index;
    beforeEach(() => { index = libclang.clang_createIndex(0, 0); });
    afterEach(() => { libclang.clang_disposeIndex(index); });

    it('should compile a valid c++ file', () => {
      const tunit = libclang.clang_createTranslationUnitFromSourceFile(
          index, path.join(__dirname, 'input/hello.cpp'), 0, 0, 0, 0);
      expect(tunit).toBeDefined();
      expect(index).not.toEqual(0);
      libclang.clang_disposeTranslationUnit(tunit);
    });

    it('should diagnose an invalid c++ file', () => {
      const tunit = libclang.clang_createTranslationUnitFromSourceFile(
          index, path.join(__dirname, 'input/missing_std.cpp'), 0, 0, 0, 0);
      expect(tunit).toBeDefined();
      expect(tunit).not.toEqual(0);

      const numDiags = libclang.clang_getNumDiagnostics(tunit);
      expect(numDiags).toBeGreaterThan(0);

      const diag = libclang.clang_getDiagnostic(tunit, 0);
      expect(diag).toBeDefined();
      expect(diag).not.toEqual(0);
      libclang.clang_disposeDiagnostic(diag);

      const diagMessage = libclang.clang_formatDiagnostic(
          diag, libclang.clang_defaultDiagnosticDisplayOptions());
      expect(diagMessage.toString().length).toBeGreaterThan(0);
      libclang.clang_disposeString(diagMessage);

      libclang.clang_disposeTranslationUnit(tunit);
    });
  });
});
