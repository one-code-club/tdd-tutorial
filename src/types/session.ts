export interface Session {
  id: string
  nickname: string
  createdAt: Date
  lastActiveAt: Date
}

export interface SessionValidationResult {
  valid: boolean
  errors: string[]
}
