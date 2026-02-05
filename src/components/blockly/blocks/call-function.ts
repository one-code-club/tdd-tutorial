import * as Blockly from 'blockly'

// シンプルな関数呼び出しブロック（引数なし）
export function registerCallFunctionBlock() {
  Blockly.Blocks['call_function'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('myFunction'), 'NAME')
        .appendField('を呼び出す')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(290)
      this.setTooltip('関数を呼び出します')
      this.setHelpUrl('')
    },
  }
}
