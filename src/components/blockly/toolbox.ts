export const toolboxConfig = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'テスト',
      colour: '210',
      contents: [
        {
          kind: 'block',
          type: 'test_case',
        },
        {
          kind: 'block',
          type: 'assert_equals',
        },
      ],
    },
    {
      kind: 'category',
      name: '関数',
      colour: '290',
      contents: [
        {
          kind: 'block',
          type: 'function_definition',
        },
        {
          kind: 'block',
          type: 'call_function',
        },
      ],
    },
    {
      kind: 'category',
      name: '変数',
      colour: '330',
      contents: [
        {
          kind: 'block',
          type: 'set_variable',
        },
        {
          kind: 'block',
          type: 'assign_variable',
        },
        {
          kind: 'block',
          type: 'get_variable',
        },
      ],
    },
    {
      kind: 'category',
      name: '入出力',
      colour: '160',
      contents: [
        {
          kind: 'block',
          type: 'print',
        },
      ],
    },
    {
      kind: 'category',
      name: '値',
      colour: '160',
      contents: [
        {
          kind: 'block',
          type: 'math_number',
        },
        {
          kind: 'block',
          type: 'text',
        },
        {
          kind: 'block',
          type: 'logic_boolean',
        },
      ],
    },
    {
      kind: 'category',
      name: '計算',
      colour: '230',
      contents: [
        {
          kind: 'block',
          type: 'math_arithmetic',
        },
        {
          kind: 'block',
          type: 'math_single',
        },
      ],
    },
    {
      kind: 'category',
      name: '論理',
      colour: '210',
      contents: [
        {
          kind: 'block',
          type: 'logic_compare',
        },
        {
          kind: 'block',
          type: 'logic_operation',
        },
        {
          kind: 'block',
          type: 'logic_negate',
        },
        {
          kind: 'block',
          type: 'controls_if',
        },
      ],
    },
    {
      kind: 'category',
      name: 'ループ',
      colour: '120',
      contents: [
        {
          kind: 'block',
          type: 'controls_repeat_ext',
        },
        {
          kind: 'block',
          type: 'controls_whileUntil',
        },
        {
          kind: 'block',
          type: 'controls_for',
        },
      ],
    },
    {
      kind: 'category',
      name: 'テキスト',
      colour: '160',
      contents: [
        {
          kind: 'block',
          type: 'text',
        },
        {
          kind: 'block',
          type: 'text_join',
        },
        {
          kind: 'block',
          type: 'text_length',
        },
      ],
    },
  ],
}
