export interface TutorialStep {
  id: string
  stepNumber: number
  title: string
  description: string
  points: string[]
  tip?: string
  expectedResult?: 'pass' | 'fail' | 'partial'
  images?: string[]
}

export interface TutorialData {
  pageTitle: string
  subtitle: string
  intro: string
  feeTable: {
    title: string
    rows: { label: string; age: string; fee: string }[]
  }
  steps: TutorialStep[]
  discussion: {
    title: string
    questions: { question: string; hint: string }[]
  }
  backToWorkspace: string
}
