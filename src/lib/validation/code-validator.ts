import type { CodeValidationResult, CodeViolation } from '@/types/execution'

interface ForbiddenPattern {
  name: string
  pattern: RegExp
  message: string
}

export const FORBIDDEN_PATTERNS: ForbiddenPattern[] = [
  // eval and Function constructor
  {
    name: 'eval',
    pattern: /\beval\s*\(/,
    message: 'eval() は使用できません',
  },
  {
    name: 'Function',
    pattern: /\bnew\s+Function\s*\(/,
    message: 'new Function() は使用できません',
  },

  // DOM access
  {
    name: 'document',
    pattern: /\bdocument\b/,
    message: 'document へのアクセスは使用できません',
  },
  {
    name: 'window',
    pattern: /\bwindow\b/,
    message: 'window へのアクセスは使用できません',
  },

  // Global objects
  {
    name: 'globalThis',
    pattern: /\bglobalThis\b/,
    message: 'globalThis へのアクセスは使用できません',
  },
  {
    name: 'process',
    pattern: /\bprocess\b/,
    message: 'process へのアクセスは使用できません',
  },
  {
    name: 'require',
    pattern: /\brequire\s*\(/,
    message: 'require() は使用できません',
  },

  // Network
  {
    name: 'fetch',
    pattern: /\bfetch\s*\(/,
    message: 'fetch() は使用できません',
  },
  {
    name: 'XMLHttpRequest',
    pattern: /\bXMLHttpRequest\b/,
    message: 'XMLHttpRequest は使用できません',
  },
  {
    name: 'WebSocket',
    pattern: /\bWebSocket\b/,
    message: 'WebSocket は使用できません',
  },

  // Storage
  {
    name: 'localStorage',
    pattern: /\blocalStorage\b/,
    message: 'localStorage は使用できません',
  },
  {
    name: 'sessionStorage',
    pattern: /\bsessionStorage\b/,
    message: 'sessionStorage は使用できません',
  },
  {
    name: 'indexedDB',
    pattern: /\bindexedDB\b/,
    message: 'indexedDB は使用できません',
  },

  // Dangerous APIs
  {
    name: 'import',
    pattern: /\bimport\s*\(/,
    message: '動的import は使用できません',
  },
  {
    name: 'Worker',
    pattern: /\bnew\s+Worker\b/,
    message: 'Worker は使用できません',
  },
  {
    name: 'SharedArrayBuffer',
    pattern: /\bSharedArrayBuffer\b/,
    message: 'SharedArrayBuffer は使用できません',
  },
]

export function validateCode(code: string): CodeValidationResult {
  const violations: CodeViolation[] = []

  for (const { name, pattern, message } of FORBIDDEN_PATTERNS) {
    if (pattern.test(code)) {
      violations.push({
        pattern: name,
        message,
        severity: 'error',
      })
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  }
}
