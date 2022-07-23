import { login } from "./auth"
import { ruleMutationResolvers } from "./rule"
import { createRule, getRuleMutation } from "./rules"

export const mutationResolvers = {
  Mutation: {
    login,
    createRule,
    rule: getRuleMutation,
  },
  RuleMutation: ruleMutationResolvers,
}
