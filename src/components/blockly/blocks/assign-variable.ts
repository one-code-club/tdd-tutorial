import * as Blockly from 'blockly'

export const ASSIGN_VARIABLE_BLOCK = {
  type: 'assign_variable',
  message0: '変数 %1 に %2 を代入',
  args0: [
    {
      type: 'field_input',
      name: 'NAME',
      text: 'myVar',
    },
    {
      type: 'input_value',
      name: 'VALUE',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 330,
  tooltip: '既存の変数に新しい値を代入します。',
  helpUrl: '',
}

export function registerAssignVariableBlock() {
  Blockly.Blocks['assign_variable'] = {
    init: function () {
      this.jsonInit(ASSIGN_VARIABLE_BLOCK)
    },
  }
}
