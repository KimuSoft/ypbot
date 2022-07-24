import { Resolver } from "../../utils"
import { channelResolvers } from "./channel"
import { guildResolvers } from "./guild"
import { getGuildById, getGuildList } from "./guilds"
import { ruleResolvers } from "./rule"
import {
  findRule,
  getOfficialRules,
  getRuleList,
  getSharedRules,
} from "./rules"
import { me, userResolvers } from "./users"

export const queryResolvers = {
  Query: {
    me,
    loginUrl: (() =>
      `https://discord.com/api/oauth2/authorize?client_id=${
        process.env.DISCORD_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        process.env.DISCORD_REDIRECT_URI!
      )}&scope=${encodeURIComponent(
        "identify"
      )}&response_type=code`) as Resolver<string>,
    inviteUrl: ((parent, params) =>
      `https://discord.com/api/oauth2/authorize?client_id=${
        process.env.DISCORD_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        process.env.DISCORD_REDIRECT_URI!
      )}&permissions=8&guild_id=${
        params.guild
      }&disable_guild_select=true&scope=${encodeURIComponent(
        "bot applications.commands"
      )}&response_type=code`) as Resolver<string, unknown, { guild: string }>,
    guilds: getGuildList,
    rules: getRuleList,
    rule: findRule,
    sharedRules: getSharedRules,
    officialRules: getOfficialRules,
    guild: getGuildById,
  },
  User: userResolvers,
  Guild: guildResolvers,
  Rule: ruleResolvers,
  Channel: channelResolvers,
}
