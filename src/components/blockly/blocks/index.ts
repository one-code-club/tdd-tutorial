import type { Translations } from '@/i18n/types'
import { registerTestCaseBlock } from './test-case'
import { registerAssertEqualsBlock } from './assert-equals'
import { registerFunctionDefinitionBlock } from './function-definition'
import { registerCallFunctionBlock } from './call-function'
import { registerSetVariableBlock } from './set-variable'
import { registerAssignVariableBlock } from './assign-variable'
import { registerGetVariableBlock } from './get-variable'
import { registerPrintBlock } from './print'

export function registerAllBlocks(t: Translations) {
  const blocks = t.blockly.blocks
  registerTestCaseBlock(blocks.testCase)
  registerAssertEqualsBlock(blocks.assertEquals)
  registerFunctionDefinitionBlock(blocks.functionDef)
  registerCallFunctionBlock(blocks.callFunction)
  registerSetVariableBlock(blocks.setVariable)
  registerAssignVariableBlock(blocks.assignVariable)
  registerGetVariableBlock(blocks.getVariable)
  registerPrintBlock(blocks.print)
}
