'use babel';

import ref from 'ref';
import ffi from 'ffi';
import ArrayType from 'ref-array';
import StructType from 'ref-struct';

const voidRef = ref.refType(ref.types.void);

const cxUnsavedFile =
    StructType({filename: 'string', contents: 'string', length: 'ulong'});
const cxString = StructType({data: voidRef, private_flags: 'uint'});

const libPath = '/usr/local/Cellar/llvm/3.6.1/lib/libclang.dylib';
const libclang = ffi.Library(libPath, {
  // Strings
  clang_getCString: ['string', [cxString]],
  clang_disposeString: ['void', [cxString]],

  // Index
  clang_createIndex: [
    voidRef,  // CXIndex
    [
      'int',  // exclude declarations from pch
      'int'   // display diagnostics
    ]
  ],
  clang_disposeIndex: ['void', [voidRef]],

  // Translation Units
  clang_createTranslationUnitFromSourceFile: [
    voidRef,  // CXTranslationUnit
    [
      voidRef,                  // index
      'string',                 // source file
      'int',                    // num args
      ArrayType('string'),      // args array
      'uint',                   // num unsaved files
      ArrayType(cxUnsavedFile)  // unsaved files array
    ]
  ],
  clang_disposeTranslationUnit: ['void', [voidRef]],

  // Diagnostics
  clang_getNumDiagnostics: [
    'uint',
    [voidRef]  // CXTranslationUnit
  ],
  clang_getDiagnostic: [
    voidRef,  // CXDiagnostic
    [
      voidRef,  // CXTranslationUnit
      'uint'
    ]
  ],
  clang_formatDiagnostic: [
    cxString,
    [
      voidRef,  // CXDiagnostic
      'uint'
    ]
  ],
  clang_defaultDiagnosticDisplayOptions: ['uint', []],
  clang_disposeDiagnostic: ['void', [voidRef]]
});

const index = libclang.clang_createIndex(0, 0);
console.log('got index');
console.log(index);

const tu = libclang.clang_createTranslationUnitFromSourceFile(
    index, 'tests/missing_std.cpp', 0, 0, 0, 0);
console.log('got tu');
console.log(tu);

const numDiags = libclang.clang_getNumDiagnostics(tu);
console.log('got diags');
console.log(numDiags);

const diag = libclang.clang_getDiagnostic(tu, 0);
console.log('diag');
console.log(diag);

const diagCxString = libclang.clang_formatDiagnostic(
    diag, libclang.clang_defaultDiagnosticDisplayOptions());
console.log(libclang.clang_getCString(diagCxString));
libclang.clang_disposeString(diagCxString);

libclang.clang_disposeDiagnostic(diag);