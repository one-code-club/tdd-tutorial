export interface RateLimiterOptions {
  maxRequests?: number
  windowMs?: number
}

const DEFAULT_MAX_REQUESTS = 10
const DEFAULT_WINDOW_MS = 60000 // 1 minute

export class RateLimiter {
  private readonly maxRequests: number
  private readonly windowMs: number
  private timestamps: number[] = []

  constructor(options: RateLimiterOptions = {}) {
    this.maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS
    this.windowMs = options.windowMs ?? DEFAULT_WINDOW_MS
  }

  private cleanupOldTimestamps(): void {
    const now = Date.now()
    const windowStart = now - this.windowMs
    this.timestamps = this.timestamps.filter((ts) => ts > windowStart)
  }

  canExecute(): boolean {
    this.cleanupOldTimestamps()
    return this.timestamps.length < this.maxRequests
  }

  recordExecution(): void {
    this.cleanupOldTimestamps()
    this.timestamps.push(Date.now())
  }

  getRemainingRequests(): number {
    this.cleanupOldTimestamps()
    return Math.max(0, this.maxRequests - this.timestamps.length)
  }

  getTimeUntilReset(): number {
    this.cleanupOldTimestamps()
    if (this.timestamps.length === 0) {
      return 0
    }

    const oldestTimestamp = Math.min(...this.timestamps)
    const resetTime = oldestTimestamp + this.windowMs
    const now = Date.now()

    return Math.max(0, resetTime - now)
  }

  reset(): void {
    this.timestamps = []
  }
}
