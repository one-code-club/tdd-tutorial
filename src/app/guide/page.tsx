'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { jaGuide } from '@/guide/ja-guide'
import { enGuide } from '@/guide/en-guide'
import { useI18n } from '@/i18n'
import {
  Target,
  LogIn,
  Code2,
  Sparkles,
  TestTube2,
  PlayCircle,
  FileJson,
  Download,
  Upload,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Check,
} from 'lucide-react'
import { parseText } from '@/lib/parse-text'

// 各セクションにアイコンを割り当てるためのマップ
const sectionIcons: Record<string, React.ElementType> = {
  purpose: Target,
  login: LogIn,
  'create-empty-function': Code2,
  'insert-sample-function': Sparkles,
  'create-test-case': TestTube2,
  'run-test': PlayCircle,
  'complete-function': Code2,
  'final-test': TestTube2,
  'export-import': FileJson,
  'sample-functions': Sparkles,
}

// セクションごとのアクセントカラー
const sectionColors: Record<string, string> = {
  purpose: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  login: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'create-empty-function': 'text-green-400 bg-green-500/10 border-green-500/20',
  'insert-sample-function': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  'create-test-case': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'run-test': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'complete-function': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'final-test': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'export-import': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'sample-functions': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
}

export default function GuidePage() {
  const { locale } = useI18n()
  const guide = locale === 'en' ? enGuide : jaGuide

  const regularSections = guide.sections.filter(
    (section) => section.id !== 'export-import' && section.id !== 'sample-functions'
  )
  const exportImportSection = guide.sections.find((section) => section.id === 'export-import')
  const sampleInsertSection = guide.sections.find((section) => section.id === 'sample-functions')

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* ヒーローセクション */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {parseText(guide.pageTitle, 'text-blue-300')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
            {parseText(guide.intro, 'text-blue-300')}
          </p>
        </div>

        {/* グリッドレイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {regularSections.map((section, index) => {
            const Icon = sectionIcons[section.id] || Target
            const colorClass = sectionColors[section.id] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'

            return (
              <div
                key={`${index}-${section.id}`}
                className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border bg-gray-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 ${
                  index === 0 ? 'md:col-span-2 lg:col-span-3 lg:flex-row lg:items-start lg:gap-8 bg-gradient-to-br from-gray-900/80 to-purple-900/10' : ''
                } ${sectionColors[section.id]?.split(' ')[2] || 'border-gray-800'}`}
              >
                {/* アイコン部分 */}
                <div className={`shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 lg:mb-0 ${colorClass.split(' ')[1]} ${colorClass.split(' ')[0]}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* コンテンツ部分 */}
                <div className={`flex-1 ${index === 0 ? 'lg:ml-0' : ''}`}>
                  <h2 className={`text-xl font-bold mb-3 group-hover:text-white transition-colors ${index === 0 ? 'text-2xl lg:mt-2' : 'text-gray-100'}`}>
                    {parseText(section.title, colorClass)}
                  </h2>
                  
                  <ul className="space-y-3">
                    {section.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                        <div className={`mt-0.5 p-0.5 rounded-full bg-white/5 shrink-0`}>
                          <Check className={`w-3.5 h-3.5 ${colorClass.split(' ')[0]}`} strokeWidth={3} />
                        </div>
                        <span className="flex-1">{parseText(point, colorClass)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 装飾用の背景エフェクト */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>

        {exportImportSection && (
          <section className="mt-12 border-y border-pink-500/25 bg-pink-950/10 py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
                    <FileJson className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-pink-300">
                    {parseText(exportImportSection.title, 'text-pink-300')}
                  </h2>
                </div>
                <p className="mt-4 text-sm text-gray-300">
                  {locale === 'en'
                    ? 'It is easiest to use these two actions depending on what you want to do.'
                    : 'データの保存と読み込みは、次の2つを使い分けるとわかりやすいです。'}
                </p>
                {exportImportSection.points.slice(2).length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {exportImportSection.points.slice(2).map((point, i) => (
                      <li key={`export-note-${i}`} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="mt-1 h-4 w-4 text-pink-300" />
                        <span>{parseText(point, 'text-pink-300')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="border-l-2 border-blue-400/70 bg-blue-500/5 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-blue-300">
                    <Download className="h-4 w-4" />
                    <span className="font-semibold">{locale === 'en' ? 'Export' : 'エクスポート'}</span>
                  </div>
                  <p className="text-sm leading-7 text-gray-200">
                    {exportImportSection.points[0] ? parseText(exportImportSection.points[0], 'text-blue-300') : null}
                  </p>
                </div>

                <div className="border-l-2 border-cyan-400/70 bg-cyan-500/5 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-cyan-300">
                    <Upload className="h-4 w-4" />
                    <span className="font-semibold">{locale === 'en' ? 'Import' : 'インポート'}</span>
                  </div>
                  <p className="text-sm leading-7 text-gray-200">
                    {exportImportSection.points[1] ? parseText(exportImportSection.points[1], 'text-cyan-300') : null}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {sampleInsertSection && (
          <section className="mt-8 border-y border-indigo-500/25 bg-indigo-950/10 py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-indigo-300">
                    {parseText(sampleInsertSection.title, 'text-indigo-300')}
                  </h2>
                </div>
                <p className="mt-4 text-sm text-gray-300">
                  {locale === 'en'
                    ? 'Sample functions help you start quickly with working examples.'
                    : 'サンプル関数は、学習を早く始めるためのお手本セットです。'}
                </p>
                {sampleInsertSection.points.slice(2).length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {sampleInsertSection.points.slice(2).map((point, i) => (
                      <li key={`sample-note-${i}`} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="mt-1 h-4 w-4 text-indigo-300" />
                        <span>{parseText(point, 'text-indigo-300')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="border-l-2 border-indigo-400/70 bg-indigo-500/5 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-indigo-300">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-semibold">
                      {locale === 'en' ? 'Available Functions' : '用意されている関数'}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-gray-200">
                    {sampleInsertSection.points[0]
                      ? parseText(sampleInsertSection.points[0], 'text-indigo-300')
                      : null}
                  </p>
                </div>

                <div className="border-l-2 border-cyan-400/70 bg-cyan-500/5 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-cyan-300">
                    <ChevronDown className="h-4 w-4" />
                    <span className="font-semibold">
                      {locale === 'en' ? 'Choose from Dropdown' : 'ドロップダウンから選ぶ'}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-gray-200">
                    {sampleInsertSection.points[1]
                      ? parseText(sampleInsertSection.points[1], 'text-cyan-300')
                      : null}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* アクションボタン */}
        <div className="mt-16 text-center">
          <Link
            href="/workspace"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-blue-600 rounded-full hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {locale === 'en' ? 'Go Back to Workspace' : 'ワークスペースに戻って試す'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* フッター的な装飾 */}
      <div className="w-full border-t border-gray-800 bg-gray-900/50 py-8 mt-12">
        <div className="text-center text-gray-500 text-sm">
          © 2024 TDD Tutorial. Enjoy Coding!
        </div>
      </div>
    </div>
  )
}
