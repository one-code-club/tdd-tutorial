import type { Translations } from '@/i18n/types'

export interface ErrorTranslation {
  friendlyMessage: string
  originalMessage: string
  hint: string
  errorType: string
}

interface ErrorPattern {
  pattern: RegExp
  getTranslation: (match: RegExpMatchArray, message: string, t: Translations) => Omit<ErrorTranslation, 'originalMessage' | 'errorType'>
}

const syntaxErrorPatterns: ErrorPattern[] = [
  {
    pattern: /Unexpected token '?([^']*)'?/,
    getTranslation: (match, _message, t) => ({
      friendlyMessage: t.errors.unexpectedToken(match[1] || ''),
      hint: t.errors.checkBlocks,
    }),
  },
  {
    pattern: /Unexpected end of input/,
    getTranslation: (_match, _message, t) => ({
      friendlyMessage: t.errors.unexpectedEnd,
      hint: t.errors.checkCompletion,
    }),
  },
]

const referenceErrorPatterns: ErrorPattern[] = [
  {
    pattern: /(\w+) is not defined/,
    getTranslation: (match, _message, t) => ({
      friendlyMessage: t.errors.notDefined(match[1]),
      hint: t.errors.checkNames,
    }),
  },
]

const typeErrorPatterns: ErrorPattern[] = [
  {
    pattern: /(\w+) is not a function/,
    getTranslation: (match, _message, t) => ({
      friendlyMessage: t.errors.notAFunction(match[1]),
      hint: t.errors.checkNames,
    }),
  },
  {
    pattern: /Cannot read property '(\w+)' of undefined/,
    getTranslation: (_match, _message, t) => ({
      friendlyMessage: t.errors.undefinedProperty,
      hint: t.errors.checkNames,
    }),
  },
  {
    pattern: /Cannot read properties of null/,
    getTranslation: (_match, _message, t) => ({
      friendlyMessage: t.errors.nullProperty,
      hint: t.errors.checkNames,
    }),
  },
]

const rangeErrorPatterns: ErrorPattern[] = [
  {
    pattern: /Maximum call stack size exceeded/,
    getTranslation: (_match, _message, t) => ({
      friendlyMessage: t.errors.stackOverflow,
      hint: t.errors.checkBlocks,
    }),
  },
]

function matchPatterns(
  message: string,
  patterns: ErrorPattern[],
  t: Translations
): Omit<ErrorTranslation, 'originalMessage' | 'errorType'> | null {
  for (const { pattern, getTranslation } of patterns) {
    const match = message.match(pattern)
    if (match) {
      return getTranslation(match, message, t)
    }
  }
  return null
}

export function translateError(error: Error | unknown, t: Translations): ErrorTranslation {
  if (!(error instanceof Error)) {
    return {
      friendlyMessage: t.common.error,
      originalMessage: String(error),
      hint: t.errors.checkBlocks,
      errorType: 'Unknown',
    }
  }

  const message = error.message
  let translation: Omit<ErrorTranslation, 'originalMessage' | 'errorType'> | null = null
  let errorType = error.name

  if (error instanceof SyntaxError) {
    translation = matchPatterns(message, syntaxErrorPatterns, t)
    errorType = 'SyntaxError'
  } else if (error instanceof ReferenceError) {
    translation = matchPatterns(message, referenceErrorPatterns, t)
    errorType = 'ReferenceError'
  } else if (error instanceof TypeError) {
    translation = matchPatterns(message, typeErrorPatterns, t)
    errorType = 'TypeError'
  } else if (error instanceof RangeError) {
    translation = matchPatterns(message, rangeErrorPatterns, t)
    errorType = 'RangeError'
  }

  if (!translation) {
    translation = {
      friendlyMessage: t.errors.genericError(message),
      hint: t.errors.checkBlocks,
    }
  }

  return {
    ...translation,
    originalMessage: message,
    errorType,
  }
}
