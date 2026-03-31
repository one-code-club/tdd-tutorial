import type { SampleCode } from './types'
import { admissionFeeSampleEn } from './admission-fee-en'

const sampleCodes: SampleCode[] = [
  admissionFeeSampleEn,
]

export function getSampleCodes(): SampleCode[] {
  return sampleCodes
}

export function getSampleById(id: string): SampleCode | undefined {
  return sampleCodes.find((sample) => sample.id === id)
}

export type { SampleCode } from './types'
