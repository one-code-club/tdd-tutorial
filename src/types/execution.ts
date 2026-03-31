export interface ExecutionResult {
  success: boolean
  output: string[]
  error?: string
  executionTime: number
}

export interface CodeValidationResult {
  valid: boolean
  violations: CodeViolation[]
}

export interface CodeViolation {
  pattern: string
  message: string
  severity: 'error' | 'warning'
}
