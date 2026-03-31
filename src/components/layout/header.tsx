'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Code2, Download, Upload, Globe, BookOpen, BookText, GraduationCap } from 'lucide-react'
import { useI18n } from '@/i18n'

interface HeaderProps {
  nickname?: string
  onLogout?: () => void
  onDownload?: () => void
  onImport?: () => void
  sampleCodes?: { id: string; name: string }[]
  onInsertSample?: (sampleId: string) => void
}

export function Header({ nickname, onLogout, onDownload, onImport, sampleCodes, onInsertSample }: HeaderProps) {
  const { locale, t, toggleLocale } = useI18n()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
      <div className="flex items-center gap-3">
        <Code2 className="h-8 w-8 text-blue-500" />
        <h1 className="text-xl font-bold text-white">{t.header.title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          title={t.header.guideTooltip}
        >
          <Link href="/guide">
            <BookText className="h-4 w-4 mr-2" />
            {t.header.guide}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              title={t.header.tutorialTooltip}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              {t.header.tutorial}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
            <DropdownMenuItem asChild className="text-gray-200 hover:text-white focus:text-white focus:bg-gray-700 cursor-pointer">
              <a href="/tutorial/en" target="_blank" rel="noopener noreferrer">
                English
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-gray-200 hover:text-white focus:text-white focus:bg-gray-700 cursor-pointer">
              <a href="/tutorial/ja" target="_blank" rel="noopener noreferrer">
                日本語
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {sampleCodes && sampleCodes.length > 0 && onInsertSample && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                title={t.header.sampleCodeTooltip}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t.header.sampleCode}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              {sampleCodes.map((sample) => (
                <DropdownMenuItem
                  key={sample.id}
                  onClick={() => onInsertSample(sample.id)}
                  className="text-gray-200 hover:text-white focus:text-white focus:bg-gray-700 cursor-pointer"
                >
                  {sample.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {(onDownload || onImport) && (
          <div className="flex items-center gap-2">
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                className="text-gray-400 hover:text-white"
                title={t.header.downloadTooltip}
              >
                <Download className="h-4 w-4 mr-2" />
                {t.header.download}
              </Button>
            )}
            {onImport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onImport}
                className="text-gray-400 hover:text-white"
                title={t.header.importTooltip}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t.header.import}
              </Button>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLocale}
          className="text-gray-400 hover:text-white"
          title={locale === 'ja' ? 'Switch to English' : '日本語に切り替え'}
        >
          <Globe className="h-4 w-4 mr-2" />
          {locale === 'ja' ? 'EN' : '日本語'}
        </Button>

        {nickname && (
          <>
            <span className="text-gray-300">
              {t.header.greeting(nickname)}
            </span>
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.header.logout}
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  )
}
