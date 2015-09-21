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

const uintPtr = ref.refType('uint');
const voidPtr = ref.refType('pointer');

const cxUnsavedFile =
  StructType({filename: 'string', contents: 'string', length: 'ulong'});
const cxString = StructType({data: 'pointer', privateFlags: 'uint'});
const cxSourceLocation =
  StructType({ptrData: ArrayType('pointer', 2), intData: 'uint'});
const cxSourceRange = StructType({
  ptrData: ArrayType('pointer', 2),
  beginIntData: 'uint',
  endIntData: 'uint'
});

const libPath = '/usr/local/Cellar/llvm/3.6.1/lib/libclang.dylib';
const libclang = ffi.Library(libPath, {
  // Strings
  clang_getCString: ['string', [cxString]],
  clang_disposeString: ['void', [cxString]],

  // File
  clang_getFileName: [
    cxString,
    ['pointer']  // CXFile
  ],

  // Index
  clang_createIndex: [
    'pointer',  // CXIndex
    [
      'int',  // exclude declarations from pch
      'int'   // display diagnostics
    ]
  ],
  clang_disposeIndex: ['void', ['pointer']],

  // Translation Units
  clang_createTranslationUnitFromSourceFile: [
    'pointer',  // CXTranslationUnit
    [
      'pointer',                // index
      'string',                 // source file
      'int',                    // num args
      ArrayType('string'),      // args array
      'uint',                   // num unsaved files
      ArrayType(cxUnsavedFile)  // unsaved files array
    ]
  ],
  clang_disposeTranslationUnit: ['void', ['pointer']],

  // Diagnostics
  clang_getNumDiagnosticsInSet: [
    'uint',
    ['pointer']  // CXDiagnosticSet
  ],
  clang_getDiagnosticInSet: [
    'pointer',  // CXDiagnostic
    [
      'pointer',  // CXDiagnosticSet
      'uint'      // index
    ]
  ],
  clang_getNumDiagnostics: [
    'uint',
    ['pointer']  // CXTranslationUnit
  ],
  clang_getDiagnostic: [
    'pointer',  // CXDiagnostic
    [
      'pointer',  // CXTranslationUnit
      'uint'      // diagnostic index
    ]
  ],
  clang_getDiagnosticSetFromTU: [
    'pointer',   // CXDiagnosticSet
    ['pointer']  // CXTranslationUnit
  ],
  clang_getChildDiagnostics: [
    'pointer',   // CXDiagnosticSet
    ['pointer']  // CXDiagnostic
  ],
  clang_formatDiagnostic: [
    cxString,
    [
      'pointer',  // CXDiagnostic
      'uint'      // options
    ]
  ],
  clang_getDiagnosticSeverity: [
    'int',       // CXDiagnosticSeverity
    ['pointer']  // CXDiagnostic
  ],
  clang_getDiagnosticLocation: [
    cxSourceLocation,
    ['pointer']  // CXDiagnostic
  ],
  clang_getDiagnosticSpelling: [
    cxString,
    ['pointer']  // CXDiagnostic
  ],
  // get options most similar to the default clang output
  clang_defaultDiagnosticDisplayOptions: ['uint', []],
  clang_disposeDiagnostic: ['void', ['pointer']],
  clang_disposeDiagnosticSet: ['void', ['pointer']],
  clang_getDiagnosticNumRanges: [
    'uint',
    ['pointer']  // CXDiagnostic
  ],
  clang_getDiagnosticRange: [
    cxSourceRange,
    [
      'pointer',  // CXDiagnostic
      'uint'      // range
    ]
  ],

  // Locations
  clang_getRangeStart: [cxSourceLocation, [cxSourceRange]],
  clang_getRangeEnd: [cxSourceLocation, [cxSourceRange]],
  clang_getSpellingLocation: [
    'void',
    [
      cxSourceLocation,
      voidPtr,  // file
      uintPtr,  // line
      uintPtr,  // column
      uintPtr   // offser
    ]
  ]
});

export default libclang;
