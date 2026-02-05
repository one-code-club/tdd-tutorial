'use client'

import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { useSession } from '@/hooks/use-session'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { session, isLoading, login } = useSession()

  useEffect(() => {
    if (!isLoading && session) {
      router.push('/workspace')
    }
  }, [isLoading, session, router])

  const handleLogin = (nickname: string) => {
    const success = login(nickname)
    if (success) {
      router.push('/workspace')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <LoginForm onSubmit={handleLogin} />
    </div>
  )
}
