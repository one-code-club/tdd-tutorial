import * as Blockly from 'blockly'
import type { Translations } from '@/i18n/types'

export function registerCallFunctionBlock(t: Translations['blockly']['blocks']['callFunction']) {
  Blockly.Blocks['call_function'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('myFunction'), 'NAME')
        .appendField(t.suffix)
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(290)
      this.setTooltip(t.tooltip)
      this.setHelpUrl('')
    },
  }
}
