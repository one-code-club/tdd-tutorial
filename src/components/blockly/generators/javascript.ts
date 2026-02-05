import { javascriptGenerator, Order } from 'blockly/javascript'

export function registerGenerators() {
  // Test Case block
  javascriptGenerator.forBlock['test_case'] = function (block) {
    const name = block.getFieldValue('NAME')
    const setup = javascriptGenerator.statementToCode(block, 'SETUP')
    const execute = javascriptGenerator.statementToCode(block, 'EXECUTE')
    const assert = javascriptGenerator.statementToCode(block, 'ASSERT')

    return `
// テスト: ${name}
(function() {
  console.log("[TEST_START] ${name}");
  try {
    // セットアップ
${setup}
    // 実行
${execute}
    // 確認
${assert}
    console.log("[TEST_PASS] ${name}");
  } catch (error) {
    console.log("[TEST_FAIL] ${name}");
    console.log("[TEST_ERROR] " + error.message);
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

    return `
if (${actual} !== ${expected}) {
  throw new Error("期待値: " + ${expected} + ", 実際: " + ${actual});
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
