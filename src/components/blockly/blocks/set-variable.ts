import * as Blockly from 'blockly'

export const SET_VARIABLE_BLOCK = {
  type: 'set_variable',
  message0: '変数 %1 を作成 値: %2',
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
  tooltip: '変数を作成して値を代入します。同じ名前の変数は作成できません。',
  helpUrl: '',
}

// 重複した変数名をチェックするバリデータ
function createDuplicateNameValidator(block: Blockly.Block) {
  return function (newValue: string): string | null {
    const workspace = block.workspace
    if (!workspace) {
      return newValue
    }

    // 現在のブロックID
    const currentBlockId = block.id

    // ワークスペース上のすべてのset_variableブロックを取得
    const allBlocks = workspace.getAllBlocks(false)
    const setVariableBlocks = allBlocks.filter(
      (b) => b.type === 'set_variable' && b.id !== currentBlockId
    )

    // 同じ名前の変数があるかチェック
    for (const otherBlock of setVariableBlocks) {
      const otherName = otherBlock.getFieldValue('NAME')
      if (otherName === newValue) {
        // 重複エラー - 警告を表示して元の値を維持
        block.setWarningText(`エラー: 変数名 "${newValue}" は既に使用されています`)
        return null // 変更を拒否
      }
    }

    // 重複なし - 警告をクリア
    block.setWarningText(null)
    return newValue
  }
}

export function registerSetVariableBlock() {
  Blockly.Blocks['set_variable'] = {
    init: function () {
      this.jsonInit(SET_VARIABLE_BLOCK)

      // 変数名フィールドにバリデータを設定
      const nameField = this.getField('NAME') as Blockly.FieldTextInput
      if (nameField) {
        nameField.setValidator(createDuplicateNameValidator(this))
      }
    },
  }
}
