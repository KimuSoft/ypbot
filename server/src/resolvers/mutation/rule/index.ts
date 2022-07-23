import { createRuleElement } from "./createRuleElement"
import { updateRuleMeta } from "./updateMeta"

export const ruleMutationResolvers = {
  updateMeta: updateRuleMeta,
  createElement: createRuleElement,
}
