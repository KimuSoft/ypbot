import { createRuleElement } from "./createRuleElement"
import { deleteRule } from "./delete"
import { getRuleElementMutation } from "./getRuleElement"
import { addRuleReference, removeRuleReference } from "./reference"
import { setRuleOfficial, setRuleSharable } from "./share"
import { updateRuleMeta } from "./updateMeta"

export const ruleMutationResolvers = {
  updateMeta: updateRuleMeta,
  createElement: createRuleElement,
  element: getRuleElementMutation,
  setSharable: setRuleSharable,
  setOfficial: setRuleOfficial,
  addReference: addRuleReference,
  removeReference: removeRuleReference,
  delete: deleteRule,
}
