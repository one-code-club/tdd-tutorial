import type { Translations } from '@/i18n/types'

export function getToolboxConfig(t: Translations) {
  const categories = t.blockly.categories

  return {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: categories.test,
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
        name: categories.functions,
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
        name: categories.variables,
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
        name: categories.io,
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
        name: categories.values,
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
        name: categories.math,
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
        name: categories.logic,
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
        name: categories.loops,
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
        name: categories.text,
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
}
