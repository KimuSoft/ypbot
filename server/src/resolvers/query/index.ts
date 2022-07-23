import { Resolver } from "../../utils"
import { guildResolvers } from "./guild"
import { getGuildList } from "./guilds"
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
    guilds: getGuildList,
  },
  User: userResolvers,
  Guild: guildResolvers,
}
