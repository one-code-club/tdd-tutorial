'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Session } from '@/types/session'
import {
  createSession,
  getSession,
  clearSession,
  updateSessionActivity,
} from '@/lib/session/session-manager'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedSession = getSession()
    setSession(storedSession)
    setIsLoading(false)
  }, [])

  const login = useCallback((nickname: string): boolean => {
    const newSession = createSession(nickname)
    if (newSession) {
      setSession(newSession)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const updateActivity = useCallback(() => {
    updateSessionActivity()
    const updated = getSession()
    setSession(updated)
  }, [])

  return {
    session,
    isLoading,
    isLoggedIn: !!session,
    login,
    logout,
    updateActivity,
  }
}
