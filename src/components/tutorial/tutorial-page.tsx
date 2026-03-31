'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageCircleQuestion,
  Check,
} from 'lucide-react'
import { parseText } from '@/lib/parse-text'
import type { TutorialData, TutorialStep } from '@/tutorial/types'

const stepColors = [
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'text-red-400 bg-red-500/10 border-red-500/30',
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'text-green-400 bg-green-500/10 border-green-500/30',
]

function ResultBadge({ result }: { result: 'pass' | 'fail' | 'partial' }) {
  if (result === 'fail') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
        <XCircle className="w-4 h-4" />
        FAIL
      </span>
    )
  }
  if (result === 'partial') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
        <AlertTriangle className="w-4 h-4" />
        PARTIAL
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
      <CheckCircle2 className="w-4 h-4" />
      PASS
    </span>
  )
}

function StepCard({ step, colorClass }: { step: TutorialStep; colorClass: string }) {
  const accentColor = colorClass.split(' ')[0]

  return (
    <div className="relative flex gap-6">
      {/* タイムラインのライン */}
      <div className="flex flex-col items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${colorClass} font-bold text-lg shrink-0`}>
          {step.stepNumber}
        </div>
        <div className="w-0.5 flex-1 bg-gray-700/50 mt-2" />
      </div>

      {/* コンテンツカード */}
      <div className={`flex-1 mb-10 rounded-2xl border bg-gray-900/50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 ${colorClass.split(' ')[2]}`}>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-xl font-bold text-gray-100">
            {parseText(step.title, accentColor)}
          </h3>
          {step.expectedResult && <ResultBadge result={step.expectedResult} />}
        </div>

        <p className="text-gray-300 leading-relaxed mb-4">
          {parseText(step.description, accentColor)}
        </p>

        <ul className="space-y-2.5">
          {step.points.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
              <div className="mt-0.5 p-0.5 rounded-full bg-white/5 shrink-0">
                <Check className={`w-3.5 h-3.5 ${accentColor}`} strokeWidth={3} />
              </div>
              <span className="flex-1">{parseText(point, accentColor)}</span>
            </li>
          ))}
        </ul>

        {step.tip && (
          <div className="mt-4 flex gap-3 border-l-4 border-amber-400/60 bg-amber-500/5 p-4 rounded-r-lg">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/90 leading-relaxed">
              {parseText(step.tip, 'text-amber-300')}
            </p>
          </div>
        )}

        {step.images && step.images.length > 0 && (
          <div className={`mt-5 flex justify-center ${step.images.length > 1 ? 'gap-4' : ''}`}>
            {step.images.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Step ${step.stepNumber} screenshot ${i + 1}`}
                width={step.images!.length > 1 ? 340 : 500}
                height={step.images!.length > 1 ? 255 : 375}
                className="rounded-lg border border-gray-700/50 object-contain"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function TutorialPage({ data }: { data: TutorialData }) {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 mb-4">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {parseText(data.pageTitle, 'text-blue-300')}
        </h1>
        <p className="text-lg text-gray-500 font-medium">{data.subtitle}</p>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
          {parseText(data.intro, 'text-blue-300')}
        </p>
      </div>

      {/* Fee Table */}
      <div className="mb-14 rounded-2xl border border-indigo-500/30 bg-gray-900/50 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <h2 className="text-xl font-bold text-indigo-300 mb-4">
              {data.feeTable.title}
            </h2>
            <table className="w-full">
              <tbody>
                {data.feeTable.rows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-700/50 last:border-b-0">
                    <td className="py-3 text-gray-300 font-medium">{row.label}</td>
                    <td className="py-3 text-gray-400 text-center">{row.age}</td>
                    <td className="py-3 text-right font-bold text-indigo-300">{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:w-64 flex items-center justify-center p-4">
            <Image
              src="/fees.png"
              alt="CSE Park admission fees"
              width={240}
              height={180}
              className="rounded-lg object-contain"
            />
          </div>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="mb-14">
        {data.steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            colorClass={stepColors[i % stepColors.length]}
          />
        ))}
        {/* タイムライン終端 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-green-500/30 bg-green-500/10">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Discussion */}
      <div className="mb-14 rounded-2xl border border-cyan-500/30 bg-gray-900/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400">
            <MessageCircleQuestion className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-cyan-300">{data.discussion.title}</h2>
        </div>
        <div className="space-y-4">
          {data.discussion.questions.map((q, i) => (
            <details key={i} className="group rounded-xl border border-gray-700/50 bg-gray-800/30 overflow-hidden">
              <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-700/20 transition-colors">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-200 font-medium">{q.question}</span>
              </summary>
              <div className="px-4 pb-4 pt-0 ml-10">
                <p className="text-sm text-gray-400 leading-relaxed">
                  {parseText(q.hint, 'text-cyan-300')}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/workspace"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-blue-600 rounded-full hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {data.backToWorkspace}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </main>
  )
}
