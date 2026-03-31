import * as Blockly from 'blockly'
import type { Translations } from '@/i18n/types'

export function registerFunctionDefinitionBlock(t: Translations['blockly']['blocks']['functionDef']) {
  Blockly.Blocks['function_definition'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(t.label)
        .appendField(new Blockly.FieldTextInput('myFunction'), 'NAME')
      this.appendStatementInput('BODY')
      this.setColour(290)
      this.setTooltip(t.tooltip)
      this.setHelpUrl('')
    },
  }
}
