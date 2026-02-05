import { describe, it, expect } from 'vitest'
import { translateError, ErrorTranslation } from './error-translator'

describe('translateError', () => {
  describe('SyntaxError', () => {
    it('should translate "Unexpected token" error', () => {
      const error = new SyntaxError("Unexpected token '}'")
      const result = translateError(error)

      expect(result.friendlyMessage).toContain('予期しない記号')
      expect(result.hint).toBeDefined()
    })

    it('should translate "Unexpected end of input" error', () => {
      const error = new SyntaxError('Unexpected end of input')
      const result = translateError(error)

      expect(result.friendlyMessage).toContain('閉じ')
      expect(result.hint).toBeDefined()
    })
  })

  describe('ReferenceError', () => {
    it('should translate "is not defined" error', () => {
      const error = new ReferenceError('myVariable is not defined')
      const result = translateError(error)

      expect(result.friendlyMessage).toContain('myVariable')
      expect(result.friendlyMessage).toContain('見つかりません')
      expect(result.hint).toBeDefined()
    })
  })

  describe('TypeError', () => {
    it('should translate "is not a function" error', () => {
      const error = new TypeError('myFunc is not a function')
      const result = translateError(error)

      expect(result.friendlyMessage).toContain('myFunc')
      expect(result.friendlyMessage).toContain('関数')
      expect(result.hint).toBeDefined()
    })

    it('should translate "Cannot read property" error', () => {
      const error = new TypeError("Cannot read property 'name' of undefined")
      const result = translateError(error)

      expect(result.friendlyMessage).toContain('undefined')
      expect(result.hint).toBeDefined()
    })

    it('should translate "Cannot read properties of null" error', () => {
      const error = new TypeError("Cannot read properties of null (reading 'name')")
      const result = translateError(error)

      expect(result.friendlyMessage).toContain('null')
      expect(result.hint).toBeDefined()
    })
  })

  describe('RangeError', () => {
    it('should translate "Maximum call stack size exceeded" error', () => {
      const error = new RangeError('Maximum call stack size exceeded')
      const result = translateError(error)

      expect(result.friendlyMessage).toContain('無限')
      expect(result.hint).toBeDefined()
    })
  })

  describe('Unknown errors', () => {
    it('should handle unknown error types gracefully', () => {
      const error = new Error('Some unknown error')
      const result = translateError(error)

      expect(result.friendlyMessage).toBeDefined()
      expect(result.originalMessage).toBe('Some unknown error')
    })

    it('should handle non-Error objects', () => {
      const result = translateError('string error' as unknown as Error)

      expect(result.friendlyMessage).toBeDefined()
    })
  })

  describe('ErrorTranslation structure', () => {
    it('should return proper ErrorTranslation structure', () => {
      const error = new SyntaxError('test')
      const result = translateError(error)

      expect(result).toHaveProperty('friendlyMessage')
      expect(result).toHaveProperty('originalMessage')
      expect(result).toHaveProperty('hint')
      expect(result).toHaveProperty('errorType')
    })
  })
})
