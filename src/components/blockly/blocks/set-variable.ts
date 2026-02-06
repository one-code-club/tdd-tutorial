import * as Blockly from 'blockly'
import type { Translations } from '@/i18n/types'

export function registerSetVariableBlock(t: Translations['blockly']['blocks']['setVariable']) {
  Blockly.Blocks['set_variable'] = {
    init: function () {
      this.jsonInit({
        type: 'set_variable',
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

      // Variable name duplicate validator
      const nameField = this.getField('NAME') as Blockly.FieldTextInput
      if (nameField) {
        nameField.setValidator(createDuplicateNameValidator(this))
      }
    },
  }
}

function createDuplicateNameValidator(block: Blockly.Block) {
  return function (newValue: string): string | null {
    const workspace = block.workspace
    if (!workspace) {
      return newValue
    }

    const currentBlockId = block.id
    const allBlocks = workspace.getAllBlocks(false)
    const setVariableBlocks = allBlocks.filter(
      (b) => b.type === 'set_variable' && b.id !== currentBlockId
    )

    for (const otherBlock of setVariableBlocks) {
      const otherName = otherBlock.getFieldValue('NAME')
      if (otherName === newValue) {
        block.setWarningText(`Error: Variable "${newValue}" already exists`)
        return null
      }
    }

    block.setWarningText(null)
    return newValue
  }
}
