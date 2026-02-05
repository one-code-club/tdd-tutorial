'use client'

import { useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Terminal, CheckCircle, XCircle, Clock, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ConsoleMessage {
  id: string
  type: 'output' | 'error' | 'success' | 'info'
  content: string
  timestamp: Date
}

interface ConsoleOutputProps {
  messages: ConsoleMessage[]
  isExecuting?: boolean
  isReady?: boolean
  onExecute?: () => void
  className?: string
}

export function ConsoleOutput({ messages, isExecuting = false, isReady = false, onExecute, className }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const getIcon = (type: ConsoleMessage['type'], content: string) => {
    // Check if it's a test result line
    if (content.includes('テスト成功')) {
      return <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
    }
    if (content.includes('テスト失敗')) {
      return <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
    }
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
      default:
        return null
    }
  }

  const getMessageStyle = (type: ConsoleMessage['type'], content: string) => {
    // Test success - green background
    if (content.includes('テスト成功')) {
      return 'text-green-300 bg-green-900/30 px-2 py-1 rounded font-semibold'
    }
    // Test failure - red background
    if (content.includes('テスト失敗')) {
      return 'text-red-300 bg-red-900/30 px-2 py-1 rounded font-semibold'
    }
    // Error details
    if (type === 'error' && !content.includes('テスト失敗')) {
      return 'text-red-400 pl-6'
    }
    switch (type) {
      case 'success':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      case 'info':
        return 'text-blue-400'
      default:
        return 'text-gray-300'
    }
  }

  return (
    <Card className={cn('bg-gray-900 border-gray-700 flex flex-col', className)}>
      <CardHeader className="py-1.5 px-3 border-b border-gray-700 flex-shrink-0 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-medium text-gray-400 flex items-center gap-2">
          <Terminal className="h-3 w-3" />
          コンソール
          {isExecuting && (
            <span className="flex items-center gap-1 text-blue-400 text-xs ml-2">
              <Clock className="h-2.5 w-2.5 animate-spin" />
              実行中...
            </span>
          )}
        </CardTitle>
        <Button
          size="sm"
          onClick={onExecute}
          className="bg-green-600 hover:bg-green-700 h-7 text-xs px-3"
          disabled={!isReady || isExecuting}
        >
          <Play className="h-3 w-3 mr-1" />
          {isExecuting ? '実行中...' : '実行'}
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto p-4 font-mono text-sm space-y-1 bg-gray-950"
        >
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              実行結果がここに表示されます
            </p>
          ) : (
            messages.map((message) => {
              // Empty line for spacing between tests
              if (message.content === '') {
                return <div key={message.id} className="h-3" />
              }
              return (
                <div
                  key={message.id}
                  className={cn('flex items-start gap-2', getMessageStyle(message.type, message.content))}
                >
                  {getIcon(message.type, message.content)}
                  <span className="whitespace-pre-wrap break-all">{message.content}</span>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
