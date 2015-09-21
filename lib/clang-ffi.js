'use babel';
//
// libclang ffi bindings
//
// Based on documentation found here:
// http://clang.llvm.org/doxygen/group__CINDEX.html
//

import ref from 'ref';
import ffi from 'ffi';
import ArrayType from 'ref-array';
import StructType from 'ref-struct';

// Types for libclang interface
const voidRef = ref.refType(ref.types.void);

const cxUnsavedFile =
  StructType({filename: 'string', contents: 'string', length: 'ulong'});
const cxString = StructType({data: voidRef, privateFlags: 'uint'});
const cxSourceLocation =
  StructType({ptrData: ArrayType(voidRef, 2), intData: 'uint'});
const cxSourceRange = StructType(
  {ptrData: ArrayType(voidRef, 2), beginIntData: 'uint', endIntData: 'uint'});

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
  clang_getNumDiagnosticsInSet: [
    'uint',
    [voidRef]  // CXDiagnosticSet
  ],
  clang_getDiagnosticInSet: [
    voidRef,  // CXDiagnostic
    [
      voidRef,  // CXDiagnosticSet
      'uint'    // index
    ]
  ],
  clang_getNumDiagnostics: [
    'uint',
    [voidRef]  // CXTranslationUnit
  ],
  clang_getDiagnostic: [
    voidRef,  // CXDiagnostic
    [
      voidRef,  // CXTranslationUnit
      'uint'    // diagnostic index
    ]
  ],
  clang_getDiagnosticSetFromTU: [
    voidRef,   // CXDiagnosticSet
    [voidRef]  // CXTranslationUnit
  ],
  clang_formatDiagnostic: [
    cxString,
    [
      voidRef,  // CXDiagnostic
      'uint'    // options
    ]
  ],
  clang_getDiagnosticSeverity: [
    'int',     // CXDiagnosticSeverity
    [voidRef]  // CXDiagnostic
  ],
  clang_getDiagnosticLocation: [
    cxSourceLocation,
    [voidRef]  // CXDiagnostic
  ],
  clang_getDiagnosticSpelling: [
    cxString,
    [voidRef]  // CXDiagnostic
  ],
  // get options most similar to the default clang output
  clang_defaultDiagnosticDisplayOptions: ['uint', []],
  clang_disposeDiagnostic: ['void', [voidRef]],
  clang_disposeDiagnosticSet: ['void', [voidRef]],
  clang_getDiagnosticRange: [
    cxSourceRange,
    [
      voidRef,  // CXDiagnostic
      'uint'    // range
    ]
  ],

  // Locations
  clang_getRangeStart: [cxSourceLocation, [cxSourceRange]],
  clang_getRangeEnd: [cxSourceLocation, [cxSourceRange]]
});

export default libclang;
