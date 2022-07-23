import { YPUser } from "shared"
import { fetchUser, Resolver } from "../../../utils"

export const me: Resolver<YPUser | null> = async (source, params, ctx) => {
  if (!ctx.user) return null

  return fetchUser(ctx.user)
}
