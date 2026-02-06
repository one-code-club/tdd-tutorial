import * as Blockly from 'blockly'
import type { Translations } from '@/i18n/types'

export function registerAssertEqualsBlock(t: Translations['blockly']['blocks']['assertEquals']) {
  Blockly.Blocks['assert_equals'] = {
    init: function () {
      this.jsonInit({
        type: 'assert_equals',
        message0: t.message,
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
        tooltip: t.tooltip,
        helpUrl: '',
      })
    },
  }
}
