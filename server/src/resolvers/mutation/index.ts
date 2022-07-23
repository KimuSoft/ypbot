import { login } from "./auth"
import { ruleMutationResolvers } from "./rule"
import { ruleElementMutationResolvers } from "./ruleElement"
import { createRule, getRuleMutation } from "./rules"
import { addShared, removeShared } from "./share"

export const mutationResolvers = {
  Mutation: {
    login,
    createRule,
    rule: getRuleMutation,
    addShared,
    removeShared,
  },
  RuleMutation: ruleMutationResolvers,
  RuleElementMutation: ruleElementMutationResolvers,
}
