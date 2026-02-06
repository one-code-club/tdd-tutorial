import * as Blockly from 'blockly'
import type { Translations } from '@/i18n/types'

export function getTestCaseBlockDef(t: Translations['blockly']['blocks']['testCase']) {
  return {
    type: 'test_case',
    message0: `${t.label} %1`,
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: t.nameDefault,
      },
    ],
    message1: `${t.setup} %1`,
    args1: [
      {
        type: 'input_statement',
        name: 'SETUP',
      },
    ],
    message2: `${t.execute} %1`,
    args2: [
      {
        type: 'input_statement',
        name: 'EXECUTE',
      },
    ],
    message3: `${t.assert} %1`,
    args3: [
      {
        type: 'input_statement',
        name: 'ASSERT',
      },
    ],
    colour: 210,
    tooltip: t.tooltip,
    helpUrl: '',
  }
}

export function registerTestCaseBlock(t: Translations['blockly']['blocks']['testCase']) {
  Blockly.Blocks['test_case'] = {
    init: function () {
      this.jsonInit(getTestCaseBlockDef(t))
    },
  }
}
