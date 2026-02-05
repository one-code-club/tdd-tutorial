'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/header'
import { ConsoleOutput } from '@/components/console/console-output'
import { useSession } from '@/hooks/use-session'
import { useCodeExecution } from '@/hooks/use-code-execution'

// Dynamically import BlocklyEditor to avoid SSR issues
const BlocklyEditor = dynamic(
  () =>
    import('@/components/blockly/blockly-editor').then((mod) => mod.BlocklyEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">エディタを読み込み中...</div>
      </div>
    ),
  }
)

export default function WorkspacePage() {
  const router = useRouter()
  const { session, isLoading, logout, updateActivity } = useSession()
  const { setCode, messages, isExecuting, execute, clearMessages } =
    useCodeExecution()

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/')
    }
  }, [isLoading, session, router])

  useEffect(() => {
    // Update activity periodically
    const interval = setInterval(() => {
      updateActivity()
    }, 60000)

    return () => clearInterval(interval)
  }, [updateActivity])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleCodeGenerated = (generatedCode: string) => {
    setCode(generatedCode)
  }

  const handleExecute = () => {
    clearMessages()
    execute()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header nickname={session.nickname} onLogout={handleLogout} />

      <main className="flex-1 p-4 flex flex-row gap-4 overflow-hidden">
        <div className="flex-1 min-w-0">
          <BlocklyEditor
            onCodeGenerated={handleCodeGenerated}
            onExecute={handleExecute}
            isExecuting={isExecuting}
            onClear={clearMessages}
            className="h-full"
          />
        </div>

        <ConsoleOutput messages={messages} isExecuting={isExecuting} className="w-80 flex-shrink-0" />
      </main>
    </div>
  )
}
