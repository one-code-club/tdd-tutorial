import * as Blockly from 'blockly'

export const GET_VARIABLE_BLOCK = {
  type: 'get_variable',
  message0: '変数 %1',
  args0: [
    {
      type: 'field_input',
      name: 'NAME',
      text: 'myVar',
    },
  ],
  output: null,
  colour: 330,
  tooltip: '変数の値を取得します。変数名をクリックして変更できます。',
  helpUrl: '',
}

export function registerGetVariableBlock() {
  Blockly.Blocks['get_variable'] = {
    init: function () {
      this.jsonInit(GET_VARIABLE_BLOCK)
    },
  }
}
