import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CodeExecutor, ExecutorOptions } from './executor'
import { ja } from '@/i18n/translations/ja'
import { en } from '@/i18n/translations/en'

describe('CodeExecutor', () => {
  let executor: CodeExecutor

  beforeEach(() => {
    vi.useFakeTimers()
    executor = new CodeExecutor()
  })

  describe('constructor', () => {
    it('should create with default options', () => {
      const exec = new CodeExecutor()
      expect(exec).toBeDefined()
    })

    it('should create with custom timeout', () => {
      const exec = new CodeExecutor({ timeoutMs: 1000 })
      expect(exec).toBeDefined()
    })
  })

  describe('execute', () => {
    it('should execute valid code and return result', async () => {
      const result = await executor.execute('1 + 1', ja)

      expect(result.success).toBe(true)
    })

    it('should capture console.log output', async () => {
      const result = await executor.execute('console.log("hello")', ja)

      expect(result.success).toBe(true)
      expect(result.output).toContain('hello')
    })

    it('should capture multiple console.log outputs', async () => {
      const result = await executor.execute(`
        console.log("first");
        console.log("second");
      `, ja)

      expect(result.success).toBe(true)
      expect(result.output).toContain('first')
      expect(result.output).toContain('second')
    })

    it('should return error for syntax errors', async () => {
      const result = await executor.execute('function {', ja)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should return error for runtime errors', async () => {
      const result = await executor.execute('throw new Error("test error")', ja)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject forbidden patterns', async () => {
      const result = await executor.execute('eval("1+1")', ja)

      expect(result.success).toBe(false)
      expect(result.error).toContain('eval')
    })

    it('should include execution time in result', async () => {
      const result = await executor.execute('1 + 1', ja)

      expect(result.executionTime).toBeDefined()
      expect(result.executionTime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('execute with English translations', () => {
    it('should return English error for forbidden patterns', async () => {
      const result = await executor.execute('eval("1+1")', en)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Forbidden code')
    })

    it('should return English error for rate limit', async () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 1 })

      await exec.execute('1', en)
      const result = await exec.execute('2', en)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limit')
    })
  })

  describe('rate limiting', () => {
    it('should allow execution under rate limit', async () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 5 })

      const result1 = await exec.execute('1', ja)
      const result2 = await exec.execute('2', ja)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
    })

    it('should block execution when rate limit exceeded', async () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 2 })

      await exec.execute('1', ja)
      await exec.execute('2', ja)
      const result = await exec.execute('3', ja)

      expect(result.success).toBe(false)
      expect(result.error).toContain('レート制限')
    })

    it('should allow execution after rate limit window resets', async () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 1 })

      await exec.execute('1', ja)
      const blockedResult = await exec.execute('2', ja)
      expect(blockedResult.success).toBe(false)

      vi.advanceTimersByTime(60001)

      const allowedResult = await exec.execute('3', ja)
      expect(allowedResult.success).toBe(true)
    })
  })

  describe('getRemainingExecutions', () => {
    it('should return max executions initially', () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 5 })
      expect(exec.getRemainingExecutions()).toBe(5)
    })

    it('should decrease after executions', async () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 5 })

      await exec.execute('1', ja)
      expect(exec.getRemainingExecutions()).toBe(4)
    })
  })
})
