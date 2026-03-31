'use client'

import { Header } from '@/components/layout/header'
import { TutorialPage } from '@/components/tutorial/tutorial-page'
import { enTutorial } from '@/tutorial/en-tutorial'

export default function EnglishTutorialPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      <Header />
      <TutorialPage data={enTutorial} />

      <div className="w-full border-t border-gray-800 bg-gray-900/50 py-8 mt-12">
        <div className="text-center text-gray-500 text-sm">
          &copy; 2024 TDD Tutorial. Enjoy Coding!
        </div>
      </div>
    </div>
  )
}
