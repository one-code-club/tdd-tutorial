'use client'

import { useState, useCallback, useRef } from 'react'
import { CodeExecutor } from '@/lib/sandbox/executor'
import type { ConsoleMessage } from '@/components/console/console-output'

export function useCodeExecution() {
  const executorRef = useRef<CodeExecutor | null>(null)
  const [messages, setMessages] = useState<ConsoleMessage[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [code, setCode] = useState('')

  // Initialize executor lazily
  const getExecutor = useCallback(() => {
    if (!executorRef.current) {
      executorRef.current = new CodeExecutor({
        timeoutMs: 5000,
        maxExecutionsPerMinute: 10,
      })
    }
    return executorRef.current
  }, [])

  const addMessage = useCallback(
    (type: ConsoleMessage['type'], content: string) => {
      const message: ConsoleMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, message])
    },
    []
  )

  const execute = useCallback(async () => {
    if (!code.trim()) {
      addMessage('info', 'コードがありません。ブロックを配置してください。')
      return
    }

    setIsExecuting(true)
    addMessage('info', '実行を開始します...')

    const executor = getExecutor()
    const result = await executor.execute(code)

    // Add output messages with test result parsing
    result.output.forEach((line) => {
      // Parse test markers and convert to appropriate message types
      if (line.startsWith('[TEST_START] ')) {
        const testName = line.replace('[TEST_START] ', '')
        addMessage('info', `📋 テスト開始: ${testName}`)
      } else if (line.startsWith('[TEST_PASS] ')) {
        const testName = line.replace('[TEST_PASS] ', '')
        addMessage('success', `✓ テスト成功: ${testName}`)
      } else if (line.startsWith('[TEST_FAIL] ')) {
        const testName = line.replace('[TEST_FAIL] ', '')
        addMessage('error', `✗ テスト失敗: ${testName}`)
      } else if (line.startsWith('[TEST_ERROR] ')) {
        const errorMsg = line.replace('[TEST_ERROR] ', '')
        addMessage('error', `    ${errorMsg}`)
      } else if (line === '[TEST_END]') {
        addMessage('output', '') // Add empty line between tests
      } else {
        addMessage('output', line)
      }
    })

    if (result.success) {
      addMessage(
        'success',
        `実行完了 (${result.executionTime.toFixed(1)}ms)`
      )
    } else {
      addMessage('error', result.error || '実行エラー')
    }

    setIsExecuting(false)
  }, [code, addMessage, getExecutor])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const getRemainingExecutions = useCallback(() => {
    return getExecutor().getRemainingExecutions()
  }, [getExecutor])

  return {
    code,
    setCode,
    messages,
    isExecuting,
    execute,
    clearMessages,
    getRemainingExecutions,
  }
}
