import { createRuleElement } from "./createRuleElement"
import { getRuleElementMutation } from "./getRuleElement"
import { setRuleSharable } from "./share"
import { updateRuleMeta } from "./updateMeta"

export const ruleMutationResolvers = {
  updateMeta: updateRuleMeta,
  createElement: createRuleElement,
  element: getRuleElementMutation,
  setSharable: setRuleSharable,
}
