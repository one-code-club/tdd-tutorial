import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  validateNickname,
  createSession,
  getSession,
  clearSession,
  updateSessionActivity,
  SESSION_STORAGE_KEY,
} from './session-manager'

describe('validateNickname', () => {
  describe('valid nicknames', () => {
    it('should accept alphanumeric nicknames', () => {
      const result = validateNickname('Player1')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept Japanese characters', () => {
      const result = validateNickname('たろう')
      expect(result.valid).toBe(true)
    })

    it('should accept mixed characters', () => {
      const result = validateNickname('プレイヤー1')
      expect(result.valid).toBe(true)
    })

    it('should accept underscores', () => {
      const result = validateNickname('player_one')
      expect(result.valid).toBe(true)
    })

    it('should accept 2-character nicknames', () => {
      const result = validateNickname('AB')
      expect(result.valid).toBe(true)
    })

    it('should accept 20-character nicknames', () => {
      const result = validateNickname('A'.repeat(20))
      expect(result.valid).toBe(true)
    })
  })

  describe('invalid nicknames', () => {
    it('should reject empty nicknames', () => {
      const result = validateNickname('')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should reject too short nicknames (1 char)', () => {
      const result = validateNickname('A')
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('2'))).toBe(true)
    })

    it('should reject too long nicknames (21+ chars)', () => {
      const result = validateNickname('A'.repeat(21))
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('20'))).toBe(true)
    })

    it('should reject nicknames with spaces', () => {
      const result = validateNickname('Player One')
      expect(result.valid).toBe(false)
    })

    it('should reject nicknames with special characters', () => {
      const result = validateNickname('Player@#$')
      expect(result.valid).toBe(false)
    })

    it('should reject whitespace-only nicknames', () => {
      const result = validateNickname('   ')
      expect(result.valid).toBe(false)
    })
  })
})

describe('Session Management', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear()
    vi.useFakeTimers()
  })

  describe('createSession', () => {
    it('should create a new session with valid nickname', () => {
      const session = createSession('TestUser')

      expect(session).not.toBeNull()
      expect(session?.nickname).toBe('TestUser')
      expect(session?.id).toBeDefined()
      expect(session?.createdAt).toBeInstanceOf(Date)
      expect(session?.lastActiveAt).toBeInstanceOf(Date)
    })

    it('should return null for invalid nickname', () => {
      const session = createSession('')
      expect(session).toBeNull()
    })

    it('should store session in sessionStorage', () => {
      createSession('TestUser')

      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
      expect(stored).not.toBeNull()

      const parsed = JSON.parse(stored!)
      expect(parsed.nickname).toBe('TestUser')
    })

    it('should generate unique session IDs', () => {
      const session1 = createSession('User1')
      sessionStorage.clear()
      const session2 = createSession('User2')

      expect(session1?.id).not.toBe(session2?.id)
    })
  })

  describe('getSession', () => {
    it('should return null when no session exists', () => {
      const session = getSession()
      expect(session).toBeNull()
    })

    it('should return the stored session', () => {
      createSession('TestUser')
      const session = getSession()

      expect(session).not.toBeNull()
      expect(session?.nickname).toBe('TestUser')
    })

    it('should parse dates correctly', () => {
      createSession('TestUser')
      const session = getSession()

      expect(session?.createdAt).toBeInstanceOf(Date)
      expect(session?.lastActiveAt).toBeInstanceOf(Date)
    })
  })

  describe('clearSession', () => {
    it('should remove session from storage', () => {
      createSession('TestUser')
      clearSession()

      const session = getSession()
      expect(session).toBeNull()
    })

    it('should handle clearing when no session exists', () => {
      // Should not throw
      expect(() => clearSession()).not.toThrow()
    })
  })

  describe('updateSessionActivity', () => {
    it('should update lastActiveAt timestamp', () => {
      createSession('TestUser')
      const initialSession = getSession()

      // Advance time
      vi.advanceTimersByTime(5000)

      updateSessionActivity()
      const updatedSession = getSession()

      expect(updatedSession?.lastActiveAt.getTime()).toBeGreaterThan(
        initialSession!.lastActiveAt.getTime()
      )
    })

    it('should do nothing when no session exists', () => {
      // Should not throw
      expect(() => updateSessionActivity()).not.toThrow()
    })
  })
})
