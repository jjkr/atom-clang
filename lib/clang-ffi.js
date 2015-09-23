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
const ptrPtr = ref.refType('pointer');

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
const cxCompletionResult =
  StructType({cursorKind: 'int', completionString: 'pointer'});
const cxCompletionResults =
  StructType({results: ref.refType(cxCompletionResult), numResults: 'uint'});

const libPath = atom.config.get('atom-clang.libclangPath');
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
  clang_parseTranslationUnit: [
    'pointer',  // CXTranslationUnit
    [
      'pointer',                 // index
      'string',                  // source file
      ArrayType('string'),       // args array
      'int',                     // num args
      ArrayType(cxUnsavedFile),  // unsaved files array
      'uint',                    // num unsaved files
      'uint'                     // options
    ]
  ],
  clang_reparseTranslationUnit: [
    'int',  // 0 for success
    [
      'pointer',                 // CXTranslationUnit
      'uint',                    // num unsaved files
      ArrayType(cxUnsavedFile),  // unsaved files array,
      'uint'                     // options
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
  clang_defaultReparseOptions: [
    'uint',
    ['pointer']  // CXTranslationUnit
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

  // Code completion
  clang_codeCompleteAt: [
    'pointer',  // CXCodeCompleteResults
    [
      'pointer',  // CXTranslationUnit
      'string',   // source file
      'uint',     // line
      'uint',     // column
      'pointer',  // unsaved files array
      'uint',     // num unsaved files
      'uint'      // options
    ]
  ],
  clang_codeCompleteGetNumDiagnostics: [
    'uint',
    ['pointer']  // CXCodeCompleteResults
  ],
  clang_codeCompleteGetDiagnostic: [
    'pointer',  // CXDiagnostic
    [
      'pointer',  // CXCodeCompleteResults
      'uint'      // index
    ]
  ],
  clang_disposeCodeCompleteResults: [
    'void',
    ['pointer']  // CXCodeCompleteResults
  ],

  // Locations
  clang_getRangeStart: [cxSourceLocation, [cxSourceRange]],
  clang_getRangeEnd: [cxSourceLocation, [cxSourceRange]],
  clang_getSpellingLocation: [
    'void',
    [
      cxSourceLocation,
      ptrPtr,   // file
      uintPtr,  // line
      uintPtr,  // column
      uintPtr   // offser
    ]
  ]
});

export default libclang;
