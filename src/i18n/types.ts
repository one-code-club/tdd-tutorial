export type Locale = 'ja' | 'en'

export interface Translations {
  common: {
    loading: string
    error: string
  }
  header: {
    title: string
    greeting: (nickname: string) => string
    logout: string
    download: string
    downloadTooltip: string
    import: string
    importTooltip: string
  }
  login: {
    title: string
    description: string
    nicknameLabel: string
    nicknamePlaceholder: string
    submitButton: string
    submitting: string
  }
  validation: {
    nicknameRequired: string
    nicknameTooShort: string
    nicknameTooLong: string
    nicknameInvalidChars: string
  }
  console: {
    title: string
    executing: string
    execute: string
    emptyMessage: string
    noCode: string
    executionStart: string
    executionComplete: (ms: string) => string
    executionError: string
    testStart: (name: string) => string
    testPass: (name: string) => string
    testFail: (name: string) => string
  }
  workspace: {
    editorLoading: string
    fileTooLarge: string
    confirmOverwrite: string
    importFailed: string
    readFailed: string
    selectFile: string
  }
  errors: {
    unexpectedToken: (token: string) => string
    checkBlocks: string
    unexpectedEnd: string
    checkCompletion: string
    notDefined: (name: string) => string
    checkNames: string
    notAFunction: (name: string) => string
    undefinedProperty: string
    nullProperty: string
    stackOverflow: string
    genericError: (message: string) => string
    timeout: string
    rateLimitExceeded: string
    forbiddenCode: (violations: string) => string
  }
  blockly: {
    categories: {
      test: string
      functions: string
      variables: string
      io: string
      values: string
      math: string
      logic: string
      loops: string
      text: string
    }
    blocks: {
      testCase: {
        label: string
        nameDefault: string
        setup: string
        execute: string
        assert: string
        tooltip: string
      }
      assertEquals: {
        message: string // e.g., "Assert %1 equals %2"
        tooltip: string
      }
      functionDef: {
        label: string
        tooltip: string
      }
      callFunction: {
        suffix: string
        tooltip: string
      }
      setVariable: {
        message: string // e.g., "Create variable %1 with value %2"
        tooltip: string
      }
      assignVariable: {
        message: string // e.g., "Set %1 to %2"
        tooltip: string
      }
      getVariable: {
        message: string // e.g., "variable %1"
        tooltip: string
      }
      print: {
        label: string
        tooltip: string
      }
    }
    codeGen: {
      testComment: (name: string) => string
      setupComment: string
      executeComment: string
      assertComment: string
      expected: string
      actual: string
    }
  }
}
