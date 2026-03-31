import * as Blockly from 'blockly'
import type { Translations } from '@/i18n/types'

export function registerPrintBlock(t: Translations['blockly']['blocks']['print']) {
  Blockly.Blocks['print'] = {
    init: function () {
      this.jsonInit({
        type: 'print',
        message0: `${t.label} %1`,
        args0: [
          {
            type: 'input_value',
            name: 'TEXT',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 160,
        tooltip: t.tooltip,
        helpUrl: '',
      })
    },
  }
}
