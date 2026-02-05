import * as Blockly from 'blockly'

// シンプルな関数定義ブロック（引数なし、戻り値なし）
export function registerFunctionDefinitionBlock() {
  Blockly.Blocks['function_definition'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('関数')
        .appendField(new Blockly.FieldTextInput('myFunction'), 'NAME')
      this.appendStatementInput('BODY')
      this.setColour(290)
      this.setTooltip('関数を定義します。中のブロックをまとめて実行できます。')
      this.setHelpUrl('')
    },
  }
}
