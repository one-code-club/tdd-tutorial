import type { SampleCode } from './types'

/**
 * Admission fee check function sample (English version)
 *
 * Logic:
 *   if (age >= 0 AND age < 12)  → fee = 500
 *   else if (age > 13 AND age < 17) → fee = 800
 *   else if (age > 18) → fee = 1000
 *   else → fee = 0
 */
export const admissionFeeSampleEn: SampleCode = {
  id: 'admission-fee',
  nameJa: '入場料関数',
  nameEn: 'Admission Fee Function',
  descriptionJa: '年齢に応じた入場料を判定する関数',
  descriptionEn: 'A function that determines admission fee based on age',
  blocks: [
    {
      type: 'function_definition',
      fields: { NAME: 'getFee' },
      inputs: {
        BODY: {
          block: {
            type: 'controls_if',
            extraState: {
              elseIfCount: 2,
              hasElse: true,
            },
            inputs: {
              // if: age >= 0 AND age < 12
              IF0: {
                block: {
                  type: 'logic_operation',
                  fields: { OP: 'AND' },
                  inputs: {
                    A: {
                      block: {
                        type: 'logic_compare',
                        fields: { OP: 'GTE' },
                        inputs: {
                          A: { block: { type: 'get_variable', fields: { NAME: 'age' } } },
                          B: { block: { type: 'math_number', fields: { NUM: 0 } } },
                        },
                      },
                    },
                    B: {
                      block: {
                        type: 'logic_compare',
                        fields: { OP: 'LT' },
                        inputs: {
                          A: { block: { type: 'get_variable', fields: { NAME: 'age' } } },
                          B: { block: { type: 'math_number', fields: { NUM: 12 } } },
                        },
                      },
                    },
                  },
                },
              },
              // do: fee = 500
              DO0: {
                block: {
                  type: 'assign_variable',
                  fields: { NAME: 'fee' },
                  inputs: {
                    VALUE: { block: { type: 'math_number', fields: { NUM: 500 } } },
                  },
                },
              },
              // else if: age > 13 AND age < 17
              IF1: {
                block: {
                  type: 'logic_operation',
                  fields: { OP: 'AND' },
                  inputs: {
                    A: {
                      block: {
                        type: 'logic_compare',
                        fields: { OP: 'GT' },
                        inputs: {
                          A: { block: { type: 'get_variable', fields: { NAME: 'age' } } },
                          B: { block: { type: 'math_number', fields: { NUM: 13 } } },
                        },
                      },
                    },
                    B: {
                      block: {
                        type: 'logic_compare',
                        fields: { OP: 'LT' },
                        inputs: {
                          A: { block: { type: 'get_variable', fields: { NAME: 'age' } } },
                          B: { block: { type: 'math_number', fields: { NUM: 17 } } },
                        },
                      },
                    },
                  },
                },
              },
              // do: fee = 800
              DO1: {
                block: {
                  type: 'assign_variable',
                  fields: { NAME: 'fee' },
                  inputs: {
                    VALUE: { block: { type: 'math_number', fields: { NUM: 800 } } },
                  },
                },
              },
              // else if: age > 18
              IF2: {
                block: {
                  type: 'logic_compare',
                  fields: { OP: 'GT' },
                  inputs: {
                    A: { block: { type: 'get_variable', fields: { NAME: 'age' } } },
                    B: { block: { type: 'math_number', fields: { NUM: 18 } } },
                  },
                },
              },
              // do: fee = 1000
              DO2: {
                block: {
                  type: 'assign_variable',
                  fields: { NAME: 'fee' },
                  inputs: {
                    VALUE: { block: { type: 'math_number', fields: { NUM: 1000 } } },
                  },
                },
              },
              // else: fee = 0
              ELSE: {
                block: {
                  type: 'assign_variable',
                  fields: { NAME: 'fee' },
                  inputs: {
                    VALUE: { block: { type: 'math_number', fields: { NUM: 0 } } },
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
}
