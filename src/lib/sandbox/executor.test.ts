import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CodeExecutor, ExecutorOptions } from './executor'

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
      const result = await executor.execute('1 + 1')

      expect(result.success).toBe(true)
    })

    it('should capture console.log output', async () => {
      const result = await executor.execute('console.log("hello")')

      expect(result.success).toBe(true)
      expect(result.output).toContain('hello')
    })

    it('should capture multiple console.log outputs', async () => {
      const result = await executor.execute(`
        console.log("first");
        console.log("second");
      `)

      expect(result.success).toBe(true)
      expect(result.output).toContain('first')
      expect(result.output).toContain('second')
    })

    it('should return error for syntax errors', async () => {
      const result = await executor.execute('function {')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should return error for runtime errors', async () => {
      const result = await executor.execute('throw new Error("test error")')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject forbidden patterns', async () => {
      const result = await executor.execute('eval("1+1")')

      expect(result.success).toBe(false)
      expect(result.error).toContain('eval')
    })

    it('should include execution time in result', async () => {
      const result = await executor.execute('1 + 1')

      expect(result.executionTime).toBeDefined()
      expect(result.executionTime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('rate limiting', () => {
    it('should allow execution under rate limit', async () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 5 })

      const result1 = await exec.execute('1')
      const result2 = await exec.execute('2')

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
    })

    it('should block execution when rate limit exceeded', async () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 2 })

      await exec.execute('1')
      await exec.execute('2')
      const result = await exec.execute('3')

      expect(result.success).toBe(false)
      expect(result.error).toContain('レート制限')
    })

    it('should allow execution after rate limit window resets', async () => {
      const exec = new CodeExecutor({ maxExecutionsPerMinute: 1 })

      await exec.execute('1')
      const blockedResult = await exec.execute('2')
      expect(blockedResult.success).toBe(false)

      vi.advanceTimersByTime(60001)

      const allowedResult = await exec.execute('3')
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

      await exec.execute('1')
      expect(exec.getRemainingExecutions()).toBe(4)
    })
  })
})
