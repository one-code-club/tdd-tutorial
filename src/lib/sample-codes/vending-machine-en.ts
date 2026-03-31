import type { SampleCode } from './types'

/**
 * Vending machine function sample (English version)
 *
 * Logic:
 *   if selectedItem == "coffee"
 *     if money >= 100
 *       purchasedItem = "coffee"
 *       change = money - 100
 *   else if selectedItem == "oolongTea"
 *     if insertedMoney >= 200
 *       purchasedItem = "oolongTea"
 *       change = money - 200
 *   else
 *     purchasedItem = "none"
 *     change = 0
 */
export const vendingMachineSampleEn: SampleCode = {
  id: 'vending-machine-en',
  nameJa: 'Vending Machine Function (English)',
  nameEn: 'Vending Machine Function (English)',
  descriptionJa: '品物と金額に応じて購入処理を行う関数（英語名）',
  descriptionEn: 'A vending machine function that processes purchases based on item and money (English names)',
  blocks: [
    {
      type: 'function_definition',
      fields: { NAME: 'vendingMachine' },
      inputs: {
        BODY: {
          block: {
            type: 'controls_if',
            extraState: {
              elseIfCount: 1,
              hasElse: true,
            },
            inputs: {
              // if: selectedItem == "coffee"
              IF0: {
                block: {
                  type: 'logic_compare',
                  fields: { OP: 'EQ' },
                  inputs: {
                    A: { block: { type: 'get_variable', fields: { NAME: 'selectedItem' } } },
                    B: { block: { type: 'text', fields: { TEXT: 'coffee' } } },
                  },
                },
              },
              // do: nested if (money >= 100)
              DO0: {
                block: {
                  type: 'controls_if',
                  inputs: {
                    IF0: {
                      block: {
                        type: 'logic_compare',
                        fields: { OP: 'GTE' },
                        inputs: {
                          A: { block: { type: 'get_variable', fields: { NAME: 'money' } } },
                          B: { block: { type: 'math_number', fields: { NUM: 100 } } },
                        },
                      },
                    },
                    DO0: {
                      block: {
                        type: 'assign_variable',
                        fields: { NAME: 'purchasedItem' },
                        inputs: {
                          VALUE: { block: { type: 'text', fields: { TEXT: 'coffee' } } },
                        },
                        next: {
                          block: {
                            type: 'assign_variable',
                            fields: { NAME: 'change' },
                            inputs: {
                              VALUE: {
                                block: {
                                  type: 'math_arithmetic',
                                  fields: { OP: 'MINUS' },
                                  inputs: {
                                    A: { block: { type: 'get_variable', fields: { NAME: 'money' } } },
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
              // else if: selectedItem == "oolongTea"
              IF1: {
                block: {
                  type: 'logic_compare',
                  fields: { OP: 'EQ' },
                  inputs: {
                    A: { block: { type: 'get_variable', fields: { NAME: 'selectedItem' } } },
                    B: { block: { type: 'text', fields: { TEXT: 'oolongTea' } } },
                  },
                },
              },
              // do: nested if (insertedMoney >= 200)
              DO1: {
                block: {
                  type: 'controls_if',
                  inputs: {
                    IF0: {
                      block: {
                        type: 'logic_compare',
                        fields: { OP: 'GTE' },
                        inputs: {
                          A: { block: { type: 'get_variable', fields: { NAME: 'insertedMoney' } } },
                          B: { block: { type: 'math_number', fields: { NUM: 200 } } },
                        },
                      },
                    },
                    DO0: {
                      block: {
                        type: 'assign_variable',
                        fields: { NAME: 'purchasedItem' },
                        inputs: {
                          VALUE: { block: { type: 'text', fields: { TEXT: 'oolongTea' } } },
                        },
                        next: {
                          block: {
                            type: 'assign_variable',
                            fields: { NAME: 'change' },
                            inputs: {
                              VALUE: {
                                block: {
                                  type: 'math_arithmetic',
                                  fields: { OP: 'MINUS' },
                                  inputs: {
                                    A: { block: { type: 'get_variable', fields: { NAME: 'money' } } },
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
              // else: purchasedItem = "none", change = 0
              ELSE: {
                block: {
                  type: 'assign_variable',
                  fields: { NAME: 'purchasedItem' },
                  inputs: {
                    VALUE: { block: { type: 'text', fields: { TEXT: 'none' } } },
                  },
                  next: {
                    block: {
                      type: 'assign_variable',
                      fields: { NAME: 'change' },
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
