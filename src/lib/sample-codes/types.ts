export interface SampleCode {
  id: string
  nameJa: string
  nameEn: string
  descriptionJa?: string
  descriptionEn?: string
  // Blockly serialization block states (each top-level block)
  blocks: object[]
}
