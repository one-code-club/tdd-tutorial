'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { validateNickname } from '@/lib/session/session-manager'
import { Code2 } from 'lucide-react'

interface LoginFormProps {
  onSubmit: (nickname: string) => void
  isLoading?: boolean
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [nickname, setNickname] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const validation = validateNickname(nickname)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    setErrors([])
    onSubmit(nickname.trim())
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Code2 className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle className="text-2xl text-white">TDD チュートリアル</CardTitle>
        <CardDescription className="text-gray-400">
          プログラミングを楽しく学ぼう！
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-gray-300">
              ニックネーム
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="ニックネームを入力"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value)
                setErrors([])
              }}
              disabled={isLoading}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
              autoFocus
            />
            {errors.length > 0 && (
              <div className="text-sm text-red-400 space-y-1">
                {errors.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'ログイン中...' : 'はじめる'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
