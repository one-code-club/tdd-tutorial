import type { ExecutionResult } from '@/types/execution'
import { validateCode } from '@/lib/validation/code-validator'
import { translateError } from '@/lib/errors/error-translator'
import { RateLimiter } from './rate-limiter'

export interface ExecutorOptions {
  timeoutMs?: number
  maxExecutionsPerMinute?: number
}

const DEFAULT_TIMEOUT_MS = 5000
const DEFAULT_MAX_EXECUTIONS = 10

export class CodeExecutor {
  private readonly timeoutMs: number
  private readonly rateLimiter: RateLimiter

  constructor(options: ExecutorOptions = {}) {
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
    this.rateLimiter = new RateLimiter({
      maxRequests: options.maxExecutionsPerMinute ?? DEFAULT_MAX_EXECUTIONS,
      windowMs: 60000,
    })
  }

  async execute(code: string): Promise<ExecutionResult> {
    const startTime = performance.now()

    // Check rate limit
    if (!this.rateLimiter.canExecute()) {
      return {
        success: false,
        output: [],
        error: 'レート制限を超えました。しばらく待ってから再試行してください。',
        executionTime: 0,
      }
    }

    // Validate code for forbidden patterns
    const validation = validateCode(code)
    if (!validation.valid) {
      const violations = validation.violations.map((v) => v.message).join(', ')
      return {
        success: false,
        output: [],
        error: `禁止されたコードが含まれています: ${violations}`,
        executionTime: 0,
      }
    }

    // Record execution for rate limiting
    this.rateLimiter.recordExecution()

    // Execute code in a sandboxed environment
    const output: string[] = []

    try {
      // Create a sandboxed console that captures output
      const sandboxedConsole = {
        log: (...args: unknown[]) => {
          output.push(args.map((arg) => String(arg)).join(' '))
        },
        error: (...args: unknown[]) => {
          output.push(`[Error] ${args.map((arg) => String(arg)).join(' ')}`)
        },
        warn: (...args: unknown[]) => {
          output.push(`[Warning] ${args.map((arg) => String(arg)).join(' ')}`)
        },
      }

      // Create a function with limited scope
      // Note: "use strict" を削除 - グローバル変数への代入を許可するため
      const wrappedCode = code

      // Execute with timeout protection
      const executeWithTimeout = new Promise<void>((resolve, reject) => {
        try {
          // eslint-disable-next-line no-new-func
          const fn = new Function('console', wrappedCode)
          fn(sandboxedConsole)
          resolve()
        } catch (error) {
          reject(error)
        }
      })

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('実行がタイムアウトしました'))
        }, this.timeoutMs)
      })

      await Promise.race([executeWithTimeout, timeoutPromise])

      const executionTime = performance.now() - startTime

      return {
        success: true,
        output,
        executionTime,
      }
    } catch (error) {
      const executionTime = performance.now() - startTime
      const translation = translateError(error)

      return {
        success: false,
        output,
        error: translation.friendlyMessage,
        executionTime,
      }
    }
  }

  getRemainingExecutions(): number {
    return this.rateLimiter.getRemainingRequests()
  }

  getTimeUntilReset(): number {
    return this.rateLimiter.getTimeUntilReset()
  }
}
