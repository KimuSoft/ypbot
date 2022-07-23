import { login } from "./auth"
import { createRule } from "./rules"

export const mutationResolvers = {
  Mutation: {
    login,
    createRule,
  },
}
