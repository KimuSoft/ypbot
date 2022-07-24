import { login } from "./auth"
import { channelMutationResolvers } from "./channel"
import { guildMutationResolvers } from "./guild"
import { getGuildMutation } from "./guilds"
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
    guild: getGuildMutation,
  },
  RuleMutation: ruleMutationResolvers,
  RuleElementMutation: ruleElementMutationResolvers,
  GuildMutation: guildMutationResolvers,
  ChannelMutation: channelMutationResolvers,
}
