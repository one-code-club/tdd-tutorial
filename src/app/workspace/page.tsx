'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/header'
import { ConsoleOutput } from '@/components/console/console-output'
import { useSession } from '@/hooks/use-session'
import { useCodeExecution } from '@/hooks/use-code-execution'
import { useI18n } from '@/i18n'
import { getSampleCodes, getSampleById } from '@/lib/sample-codes'
import type { BlocklyEditorHandle } from '@/components/blockly/blockly-editor'

// Dynamically import BlocklyEditor to avoid SSR issues
const BlocklyEditor = dynamic(
  () =>
    import('@/components/blockly/blockly-editor').then((mod) => mod.BlocklyEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading editor...</div>
      </div>
    ),
  }
)

export default function WorkspacePage() {
  const router = useRouter()
  const { locale, t } = useI18n()
  const blocklyRef = useRef<BlocklyEditorHandle>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editorReady, setEditorReady] = useState(false)
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

  const handleTestResult = useCallback((blockId: string, passed: boolean, errorMessage?: string) => {
    blocklyRef.current?.setTestResult(blockId, passed, errorMessage)
  }, [])

  const handleExecute = () => {
    clearMessages()
    blocklyRef.current?.resetBlockColours()
    blocklyRef.current?.handleExecute()
  }

  const sampleCodeList = useMemo(() => {
    const samples = getSampleCodes()
    return samples.map((s) => ({
      id: s.id,
      name: locale === 'ja' ? s.nameJa : s.nameEn,
    }))
  }, [locale])

  const handleInsertSample = useCallback((sampleId: string) => {
    const sample = getSampleById(sampleId)
    if (sample) {
      blocklyRef.current?.insertBlocks(sample.blocks)
    }
  }, [])

  const handleDownload = useCallback(() => {
    const json = blocklyRef.current?.exportWorkspace()
    if (json) {
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tdd-blocks-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // File size limit: 5MB
      const MAX_FILE_SIZE = 5 * 1024 * 1024
      if (file.size > MAX_FILE_SIZE) {
        alert(t.workspace.fileTooLarge)
        e.target.value = ''
        return
      }

      // Confirm before overwriting
      if (!window.confirm(t.workspace.confirmOverwrite)) {
        e.target.value = ''
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const json = event.target?.result as string
        const success = blocklyRef.current?.importWorkspace(json)
        if (!success) {
          alert(t.workspace.importFailed)
        }
      }
      reader.onerror = () => {
        alert(t.workspace.readFailed)
      }
      reader.readAsText(file)
    }
    // Reset to allow re-selecting the same file
    e.target.value = ''
  }, [t.workspace])

  // Poll for editor ready state
  useEffect(() => {
    const checkReady = () => {
      if (blocklyRef.current?.isReady) {
        setEditorReady(true)
      }
    }
    const interval = setInterval(checkReady, 100)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">{t.common.loading}</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header
        nickname={session.nickname}
        onLogout={handleLogout}
        onDownload={handleDownload}
        onImport={handleImportClick}
        sampleCodes={sampleCodeList}
        onInsertSample={handleInsertSample}
      />

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-label={t.workspace.selectFile}
      />

      <main className="flex-1 p-4 flex flex-row gap-4 overflow-hidden">
        <div className="flex-1 min-w-0">
          <BlocklyEditor
            ref={blocklyRef}
            onCodeGenerated={handleCodeGenerated}
            onExecute={(code) => execute(code, handleTestResult)}
            className="h-full"
          />
        </div>

        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
          <ConsoleOutput
            messages={messages}
            isExecuting={isExecuting}
            isReady={editorReady}
            onExecute={handleExecute}
            className="flex-1 min-h-0"
          />
          <div className="flex-shrink-0">
            <img
              src="/fees.png"
              alt="Fees"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
