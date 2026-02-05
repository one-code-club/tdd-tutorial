'use client'

import { Button } from '@/components/ui/button'
import { LogOut, Code2 } from 'lucide-react'

interface HeaderProps {
  nickname?: string
  onLogout?: () => void
}

export function Header({ nickname, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
      <div className="flex items-center gap-3">
        <Code2 className="h-8 w-8 text-blue-500" />
        <h1 className="text-xl font-bold text-white">TDD チュートリアル</h1>
      </div>

      {nickname && (
        <div className="flex items-center gap-4">
          <span className="text-gray-300">
            こんにちは、<span className="font-medium text-white">{nickname}</span> さん
          </span>
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
