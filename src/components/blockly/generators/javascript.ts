import { javascriptGenerator, Order } from 'blockly/javascript'
import type { Translations } from '@/i18n/types'

export function registerGenerators(t: Translations) {
  const cg = t.blockly.codeGen

  // Test Case block
  javascriptGenerator.forBlock['test_case'] = function (block) {
    const name = block.getFieldValue('NAME')
    const setup = javascriptGenerator.statementToCode(block, 'SETUP')
    const execute = javascriptGenerator.statementToCode(block, 'EXECUTE')
    const assert = javascriptGenerator.statementToCode(block, 'ASSERT')

    const blockId = block.id

    return `
${cg.testComment(name)}
(function() {
  console.log("[TEST_START] ${name}");
  console.log("[TEST_BLOCK_ID] ${blockId}");
  try {
    ${cg.setupComment}
${setup}
    ${cg.executeComment}
${execute}
    ${cg.assertComment}
${assert}
    console.log("[TEST_PASS] ${name}");
  } catch (error) {
    console.log("[TEST_ERROR] " + error.message);
    console.log("[TEST_FAIL] ${name}");
  }
  console.log("[TEST_END]");
})();
`
  }

  // Assert Equals block
  javascriptGenerator.forBlock['assert_equals'] = function (block) {
    const actual =
      javascriptGenerator.valueToCode(block, 'ACTUAL', Order.ATOMIC) || 'undefined'
    const expected =
      javascriptGenerator.valueToCode(block, 'EXPECTED', Order.ATOMIC) || 'undefined'

    const errorExpr = cg.assertErrorExpression(actual, expected)

    return `
if (${actual} !== ${expected}) {
  throw new Error(${errorExpr});
}
`
  }

  // Function Definition block（引数なし、戻り値なし）
  javascriptGenerator.forBlock['function_definition'] = function (block) {
    const name = block.getFieldValue('NAME')
    const body = javascriptGenerator.statementToCode(block, 'BODY')

    return `function ${name}() {\n${body}}\n`
  }

  // Call Function block（引数なし）
  javascriptGenerator.forBlock['call_function'] = function (block) {
    const name = block.getFieldValue('NAME')
    return `${name}();\n`
  }

  // Set Variable block（変数を作成）- グローバル変数として扱う
  javascriptGenerator.forBlock['set_variable'] = function (block) {
    const name = block.getFieldValue('NAME')
    const value =
      javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || 'undefined'

    return `${name} = ${value};\n`
  }

  // Assign Variable block（変数に代入）
  javascriptGenerator.forBlock['assign_variable'] = function (block) {
    const name = block.getFieldValue('NAME')
    const value =
      javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || 'undefined'

    return `${name} = ${value};\n`
  }

  // Get Variable block
  javascriptGenerator.forBlock['get_variable'] = function (block) {
    const name = block.getFieldValue('NAME')
    return [name, Order.ATOMIC]
  }

  // Print block
  javascriptGenerator.forBlock['print'] = function (block) {
    const text =
      javascriptGenerator.valueToCode(block, 'TEXT', Order.ATOMIC) || '""'
    return `console.log(${text});\n`
  }
}
