import { User } from "shared"
import { fetchUser, Resolver } from "../../../utils"

export const me: Resolver<User | null> = async (source, params, ctx) => {
  if (!ctx.user) return null

  return fetchUser(ctx.user)
}
