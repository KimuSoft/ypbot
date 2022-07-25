import { deleteRuleElement } from "./delete"
import { updateRuleElement } from "./update"

export const ruleElementMutationResolvers = {
  update: updateRuleElement,
  delete: deleteRuleElement,
}
