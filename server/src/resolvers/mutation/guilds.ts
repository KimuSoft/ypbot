import { AuthenticationError } from "apollo-server-express"
import { Resolver } from "../../utils"
import { FullGuild, getGuild } from "../query/guilds"

export const getGuildMutation: Resolver<
  FullGuild | null,
  unknown,
  { id: string }
> = async (parent, params, ctx) => {
  if (!ctx.user)
    throw new AuthenticationError("You must be logged in to do this action")
  const guild = await getGuild(ctx.user, params.id)

  return guild
}
