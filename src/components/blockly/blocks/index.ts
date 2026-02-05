import { registerTestCaseBlock } from './test-case'
import { registerAssertEqualsBlock } from './assert-equals'
import { registerFunctionDefinitionBlock } from './function-definition'
import { registerCallFunctionBlock } from './call-function'
import { registerSetVariableBlock } from './set-variable'
import { registerAssignVariableBlock } from './assign-variable'
import { registerGetVariableBlock } from './get-variable'
import { registerPrintBlock } from './print'

export function registerAllBlocks() {
  registerTestCaseBlock()
  registerAssertEqualsBlock()
  registerFunctionDefinitionBlock()
  registerCallFunctionBlock()
  registerSetVariableBlock()
  registerAssignVariableBlock()
  registerGetVariableBlock()
  registerPrintBlock()
}
