import * as Blockly from 'blockly'
import type { Translations } from '@/i18n/types'

export function registerAssignVariableBlock(t: Translations['blockly']['blocks']['assignVariable']) {
  Blockly.Blocks['assign_variable'] = {
    init: function () {
      this.jsonInit({
        type: 'assign_variable',
        message0: t.message,
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
        tooltip: t.tooltip,
        helpUrl: '',
      })
    },
  }
}
