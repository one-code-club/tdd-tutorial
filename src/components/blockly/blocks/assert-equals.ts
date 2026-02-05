import * as Blockly from 'blockly'

export const ASSERT_EQUALS_BLOCK = {
  type: 'assert_equals',
  message0: '%1 が %2 と等しいことを確認',
  args0: [
    {
      type: 'input_value',
      name: 'ACTUAL',
    },
    {
      type: 'input_value',
      name: 'EXPECTED',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: '2つの値が等しいことを確認します',
  helpUrl: '',
}

export function registerAssertEqualsBlock() {
  Blockly.Blocks['assert_equals'] = {
    init: function () {
      this.jsonInit(ASSERT_EQUALS_BLOCK)
    },
  }
}
