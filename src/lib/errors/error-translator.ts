export interface ErrorTranslation {
  friendlyMessage: string
  originalMessage: string
  hint: string
  errorType: string
}

interface ErrorPattern {
  pattern: RegExp
  getTranslation: (match: RegExpMatchArray, message: string) => Omit<ErrorTranslation, 'originalMessage' | 'errorType'>
}

const syntaxErrorPatterns: ErrorPattern[] = [
  {
    pattern: /Unexpected token '?([^']*)'?/,
    getTranslation: (match) => ({
      friendlyMessage: `予期しない記号「${match[1] || ''}」が見つかりました`,
      hint: 'ブロックの接続が正しいか確認してください。括弧やセミコロンが足りないかもしれません。',
    }),
  },
  {
    pattern: /Unexpected end of input/,
    getTranslation: () => ({
      friendlyMessage: 'コードが途中で終わっています。閉じ括弧が足りないかもしれません',
      hint: '開いた括弧 { や ( に対応する閉じ括弧 } や ) があるか確認してください。',
    }),
  },
]

const referenceErrorPatterns: ErrorPattern[] = [
  {
    pattern: /(\w+) is not defined/,
    getTranslation: (match) => ({
      friendlyMessage: `「${match[1]}」という名前が見つかりません`,
      hint: '変数や関数の名前が正しいか確認してください。使う前に定義されているか確認しましょう。',
    }),
  },
]

const typeErrorPatterns: ErrorPattern[] = [
  {
    pattern: /(\w+) is not a function/,
    getTranslation: (match) => ({
      friendlyMessage: `「${match[1]}」は関数ではありません`,
      hint: '関数として呼び出そうとしていますが、これは関数ではありません。名前を確認してください。',
    }),
  },
  {
    pattern: /Cannot read property '(\w+)' of undefined/,
    getTranslation: () => ({
      friendlyMessage: 'undefinedの値からプロパティを読み取ろうとしました',
      hint: '変数の値がundefinedになっていないか確認してください。',
    }),
  },
  {
    pattern: /Cannot read properties of null/,
    getTranslation: () => ({
      friendlyMessage: 'nullの値からプロパティを読み取ろうとしました',
      hint: '変数の値がnullになっていないか確認してください。',
    }),
  },
]

const rangeErrorPatterns: ErrorPattern[] = [
  {
    pattern: /Maximum call stack size exceeded/,
    getTranslation: () => ({
      friendlyMessage: '関数が無限に呼び出されています',
      hint: '関数が自分自身を呼び出し続けていないか確認してください。終了条件が必要です。',
    }),
  },
]

function matchPatterns(
  message: string,
  patterns: ErrorPattern[]
): Omit<ErrorTranslation, 'originalMessage' | 'errorType'> | null {
  for (const { pattern, getTranslation } of patterns) {
    const match = message.match(pattern)
    if (match) {
      return getTranslation(match, message)
    }
  }
  return null
}

export function translateError(error: Error | unknown): ErrorTranslation {
  if (!(error instanceof Error)) {
    return {
      friendlyMessage: 'エラーが発生しました',
      originalMessage: String(error),
      hint: 'コードを確認してください。',
      errorType: 'Unknown',
    }
  }

  const message = error.message
  let translation: Omit<ErrorTranslation, 'originalMessage' | 'errorType'> | null = null
  let errorType = error.name

  if (error instanceof SyntaxError) {
    translation = matchPatterns(message, syntaxErrorPatterns)
    errorType = 'SyntaxError'
  } else if (error instanceof ReferenceError) {
    translation = matchPatterns(message, referenceErrorPatterns)
    errorType = 'ReferenceError'
  } else if (error instanceof TypeError) {
    translation = matchPatterns(message, typeErrorPatterns)
    errorType = 'TypeError'
  } else if (error instanceof RangeError) {
    translation = matchPatterns(message, rangeErrorPatterns)
    errorType = 'RangeError'
  }

  if (!translation) {
    translation = {
      friendlyMessage: `エラー: ${message}`,
      hint: 'コードを見直してください。',
    }
  }

  return {
    ...translation,
    originalMessage: message,
    errorType,
  }
}
