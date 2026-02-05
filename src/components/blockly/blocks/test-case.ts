import * as Blockly from 'blockly'

export const TEST_CASE_BLOCK = {
  type: 'test_case',
  message0: 'テスト %1',
  args0: [
    {
      type: 'field_input',
      name: 'NAME',
      text: 'テスト名',
    },
  ],
  message1: 'セットアップ %1',
  args1: [
    {
      type: 'input_statement',
      name: 'SETUP',
    },
  ],
  message2: '実行 %1',
  args2: [
    {
      type: 'input_statement',
      name: 'EXECUTE',
    },
  ],
  message3: '確認 %1',
  args3: [
    {
      type: 'input_statement',
      name: 'ASSERT',
    },
  ],
  colour: 210,
  tooltip: 'テストケースを定義します',
  helpUrl: '',
}

export function registerTestCaseBlock() {
  Blockly.Blocks['test_case'] = {
    init: function () {
      this.jsonInit(TEST_CASE_BLOCK)
    },
  }
}
