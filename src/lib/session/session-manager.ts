import type { Session, SessionValidationResult } from '@/types/session'

export const SESSION_STORAGE_KEY = 'tdd-tutorial-session'

// Nickname validation: 2-20 characters, alphanumeric, Japanese, or underscore
const NICKNAME_PATTERN = /^[\p{L}\p{N}_]{2,20}$/u

export interface ValidationTranslations {
  nicknameRequired: string
  nicknameTooShort: string
  nicknameTooLong: string
  nicknameInvalidChars: string
}

const defaultTranslations: ValidationTranslations = {
  nicknameRequired: 'ニックネームを入力してください',
  nicknameTooShort: 'ニックネームは2文字以上で入力してください',
  nicknameTooLong: 'ニックネームは20文字以下で入力してください',
  nicknameInvalidChars: 'ニックネームは文字、数字、アンダースコアのみ使用できます',
}

export function validateNickname(
  nickname: string,
  translations: ValidationTranslations = defaultTranslations
): SessionValidationResult {
  const errors: string[] = []
  const trimmed = nickname.trim()

  if (trimmed.length === 0) {
    errors.push(translations.nicknameRequired)
    return { valid: false, errors }
  }

  if (trimmed.length < 2) {
    errors.push(translations.nicknameTooShort)
  }

  if (trimmed.length > 20) {
    errors.push(translations.nicknameTooLong)
  }

  if (!NICKNAME_PATTERN.test(trimmed)) {
    errors.push(translations.nicknameInvalidChars)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

export function createSession(nickname: string): Session | null {
  const validation = validateNickname(nickname)
  if (!validation.valid) {
    return null
  }

  const now = new Date()
  const session: Session = {
    id: generateSessionId(),
    nickname: nickname.trim(),
    createdAt: now,
    lastActiveAt: now,
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  return session
}

export function getSession(): Session | null {
  const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (!stored) {
    return null
  }

  try {
    const parsed = JSON.parse(stored)
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      lastActiveAt: new Date(parsed.lastActiveAt),
    }
  } catch {
    return null
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

export function updateSessionActivity(): void {
  const session = getSession()
  if (!session) {
    return
  }

  const updated: Session = {
    ...session,
    lastActiveAt: new Date(),
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated))
}
