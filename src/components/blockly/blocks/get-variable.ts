import * as Blockly from 'blockly'
import type { Translations } from '@/i18n/types'

export function registerGetVariableBlock(t: Translations['blockly']['blocks']['getVariable']) {
  Blockly.Blocks['get_variable'] = {
    init: function () {
      this.jsonInit({
        type: 'get_variable',
        message0: t.message,
        args0: [
          {
            type: 'field_input',
            name: 'NAME',
            text: 'myVar',
          },
        ],
        output: null,
        colour: 330,
        tooltip: t.tooltip,
        helpUrl: '',
      })
    },
  }
}
