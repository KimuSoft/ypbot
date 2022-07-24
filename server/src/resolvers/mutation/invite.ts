import { RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult } from "discord-api-types/v10"
import { discordApi, Resolver } from "../../utils"

export const processInvite: Resolver<
  string | null,
  unknown,
  { code: string }
> = async (parent, { code }) => {
  const { data } =
    await discordApi.post<RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult>(
      "/oauth2/token",
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        redirect_uri: process.env.DISCORD_INVITE_CALLBACK!,
        grant_type: "authorization_code",
        code,
      })
    )

  return data.guild.id
}
