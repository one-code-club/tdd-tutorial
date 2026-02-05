import * as Blockly from 'blockly'

export const PRINT_BLOCK = {
  type: 'print',
  message0: '出力 %1',
  args0: [
    {
      type: 'input_value',
      name: 'TEXT',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: 'コンソールに値を出力します',
  helpUrl: '',
}

export function registerPrintBlock() {
  Blockly.Blocks['print'] = {
    init: function () {
      this.jsonInit(PRINT_BLOCK)
    },
  }
}
