import type { SampleCode } from './types'

/**
 * 自動販売機関数サンプル（日本語版）
 *
 * ロジック:
 *   if 選んだ品物 == "コーヒー"
 *     if お金 >= 100
 *       買えた品物 = "コーヒー"
 *       おつり = お金 - 100
 *   else if 選んだ品物 == "ウーロン茶"
 *     if 入れたお金 >= 200
 *       買えた品物 = "ウーロン茶"
 *       おつり = お金 - 200
 *   else
 *     買えた品物 = "なし"
 *     おつり = 0
 */
export const vendingMachineSample: SampleCode = {
  id: 'vending-machine',
  nameJa: '自動販売機関数（日本語）',
  nameEn: '自動販売機関数（日本語）',
  descriptionJa: '品物と金額に応じて購入処理を行う関数',
  descriptionEn: 'A vending machine function that processes purchases based on item and money',
  blocks: [
    {
      type: 'function_definition',
      fields: { NAME: '自動販売機' },
      inputs: {
        BODY: {
          block: {
            type: 'controls_if',
            extraState: {
              elseIfCount: 1,
              hasElse: true,
            },
            inputs: {
              // if: 選んだ品物 == "コーヒー"
              IF0: {
                block: {
                  type: 'logic_compare',
                  fields: { OP: 'EQ' },
                  inputs: {
                    A: { block: { type: 'get_variable', fields: { NAME: '選んだ品物' } } },
                    B: { block: { type: 'text', fields: { TEXT: 'コーヒー' } } },
                  },
                },
              },
              // do: nested if (お金 >= 100)
              DO0: {
                block: {
                  type: 'controls_if',
                  inputs: {
                    IF0: {
                      block: {
                        type: 'logic_compare',
                        fields: { OP: 'GTE' },
                        inputs: {
                          A: { block: { type: 'get_variable', fields: { NAME: 'お金' } } },
                          B: { block: { type: 'math_number', fields: { NUM: 100 } } },
                        },
                      },
                    },
                    DO0: {
                      block: {
                        type: 'assign_variable',
                        fields: { NAME: '買えた品物' },
                        inputs: {
                          VALUE: { block: { type: 'text', fields: { TEXT: 'コーヒー' } } },
                        },
                        next: {
                          block: {
                            type: 'assign_variable',
                            fields: { NAME: 'おつり' },
                            inputs: {
                              VALUE: {
                                block: {
                                  type: 'math_arithmetic',
                                  fields: { OP: 'MINUS' },
                                  inputs: {
                                    A: { block: { type: 'get_variable', fields: { NAME: 'お金' } } },
                                    B: { block: { type: 'math_number', fields: { NUM: 100 } } },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              // else if: 選んだ品物 == "ウーロン茶"
              IF1: {
                block: {
                  type: 'logic_compare',
                  fields: { OP: 'EQ' },
                  inputs: {
                    A: { block: { type: 'get_variable', fields: { NAME: '選んだ品物' } } },
                    B: { block: { type: 'text', fields: { TEXT: 'ウーロン茶' } } },
                  },
                },
              },
              // do: nested if (入れたお金 >= 200)
              DO1: {
                block: {
                  type: 'controls_if',
                  inputs: {
                    IF0: {
                      block: {
                        type: 'logic_compare',
                        fields: { OP: 'GTE' },
                        inputs: {
                          A: { block: { type: 'get_variable', fields: { NAME: '入れたお金' } } },
                          B: { block: { type: 'math_number', fields: { NUM: 200 } } },
                        },
                      },
                    },
                    DO0: {
                      block: {
                        type: 'assign_variable',
                        fields: { NAME: '買えた品物' },
                        inputs: {
                          VALUE: { block: { type: 'text', fields: { TEXT: 'ウーロン茶' } } },
                        },
                        next: {
                          block: {
                            type: 'assign_variable',
                            fields: { NAME: 'おつり' },
                            inputs: {
                              VALUE: {
                                block: {
                                  type: 'math_arithmetic',
                                  fields: { OP: 'MINUS' },
                                  inputs: {
                                    A: { block: { type: 'get_variable', fields: { NAME: 'お金' } } },
                                    B: { block: { type: 'math_number', fields: { NUM: 200 } } },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              // else: 買えた品物 = "なし", おつり = 0
              ELSE: {
                block: {
                  type: 'assign_variable',
                  fields: { NAME: '買えた品物' },
                  inputs: {
                    VALUE: { block: { type: 'text', fields: { TEXT: 'なし' } } },
                  },
                  next: {
                    block: {
                      type: 'assign_variable',
                      fields: { NAME: 'おつり' },
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
      },
    },
  ],
}
