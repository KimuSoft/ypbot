import { getUserRules } from "./rules"

export * from "./me"

export const userResolvers = {
  rules: getUserRules,
}
