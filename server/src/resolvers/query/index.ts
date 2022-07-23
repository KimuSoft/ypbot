import { Resolver } from "../../utils"
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
  },
  User: userResolvers,
}
