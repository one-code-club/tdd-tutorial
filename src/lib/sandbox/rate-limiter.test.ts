import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RateLimiter } from './rate-limiter'

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('constructor', () => {
    it('should create with default values', () => {
      const limiter = new RateLimiter()
      expect(limiter.canExecute()).toBe(true)
    })

    it('should create with custom maxRequests', () => {
      const limiter = new RateLimiter({ maxRequests: 5 })

      for (let i = 0; i < 5; i++) {
        expect(limiter.canExecute()).toBe(true)
        limiter.recordExecution()
      }

      expect(limiter.canExecute()).toBe(false)
    })

    it('should create with custom windowMs', () => {
      const limiter = new RateLimiter({ maxRequests: 2, windowMs: 1000 })

      limiter.recordExecution()
      limiter.recordExecution()
      expect(limiter.canExecute()).toBe(false)

      vi.advanceTimersByTime(1001)
      expect(limiter.canExecute()).toBe(true)
    })
  })

  describe('canExecute', () => {
    it('should return true when under limit', () => {
      const limiter = new RateLimiter({ maxRequests: 3 })

      limiter.recordExecution()
      expect(limiter.canExecute()).toBe(true)
    })

    it('should return false when at limit', () => {
      const limiter = new RateLimiter({ maxRequests: 2 })

      limiter.recordExecution()
      limiter.recordExecution()
      expect(limiter.canExecute()).toBe(false)
    })

    it('should return true after window expires', () => {
      const limiter = new RateLimiter({ maxRequests: 1, windowMs: 5000 })

      limiter.recordExecution()
      expect(limiter.canExecute()).toBe(false)

      vi.advanceTimersByTime(5001)
      expect(limiter.canExecute()).toBe(true)
    })
  })

  describe('recordExecution', () => {
    it('should increment request count', () => {
      const limiter = new RateLimiter({ maxRequests: 3 })

      expect(limiter.getRemainingRequests()).toBe(3)
      limiter.recordExecution()
      expect(limiter.getRemainingRequests()).toBe(2)
    })
  })

  describe('getRemainingRequests', () => {
    it('should return max when no requests made', () => {
      const limiter = new RateLimiter({ maxRequests: 5 })
      expect(limiter.getRemainingRequests()).toBe(5)
    })

    it('should return correct remaining after executions', () => {
      const limiter = new RateLimiter({ maxRequests: 5 })

      limiter.recordExecution()
      limiter.recordExecution()

      expect(limiter.getRemainingRequests()).toBe(3)
    })

    it('should return 0 when at limit', () => {
      const limiter = new RateLimiter({ maxRequests: 2 })

      limiter.recordExecution()
      limiter.recordExecution()

      expect(limiter.getRemainingRequests()).toBe(0)
    })

    it('should reset after window expires', () => {
      const limiter = new RateLimiter({ maxRequests: 3, windowMs: 1000 })

      limiter.recordExecution()
      limiter.recordExecution()
      expect(limiter.getRemainingRequests()).toBe(1)

      vi.advanceTimersByTime(1001)
      expect(limiter.getRemainingRequests()).toBe(3)
    })
  })

  describe('getTimeUntilReset', () => {
    it('should return 0 when no requests made', () => {
      const limiter = new RateLimiter()
      expect(limiter.getTimeUntilReset()).toBe(0)
    })

    it('should return remaining time after execution', () => {
      const limiter = new RateLimiter({ windowMs: 10000 })

      limiter.recordExecution()
      vi.advanceTimersByTime(3000)

      expect(limiter.getTimeUntilReset()).toBeCloseTo(7000, -2)
    })

    it('should return 0 after window expires', () => {
      const limiter = new RateLimiter({ windowMs: 5000 })

      limiter.recordExecution()
      vi.advanceTimersByTime(5001)

      expect(limiter.getTimeUntilReset()).toBe(0)
    })
  })

  describe('reset', () => {
    it('should clear all recorded executions', () => {
      const limiter = new RateLimiter({ maxRequests: 2 })

      limiter.recordExecution()
      limiter.recordExecution()
      expect(limiter.canExecute()).toBe(false)

      limiter.reset()
      expect(limiter.canExecute()).toBe(true)
      expect(limiter.getRemainingRequests()).toBe(2)
    })
  })
})
