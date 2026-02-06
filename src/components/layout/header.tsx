'use client'

import { Button } from '@/components/ui/button'
import { LogOut, Code2, Download, Upload, Globe } from 'lucide-react'
import { useI18n } from '@/i18n'

interface HeaderProps {
  nickname?: string
  onLogout?: () => void
  onDownload?: () => void
  onImport?: () => void
}

export function Header({ nickname, onLogout, onDownload, onImport }: HeaderProps) {
  const { locale, t, toggleLocale } = useI18n()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
      <div className="flex items-center gap-3">
        <Code2 className="h-8 w-8 text-blue-500" />
        <h1 className="text-xl font-bold text-white">{t.header.title}</h1>
      </div>

      <div className="flex items-center gap-4">
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
