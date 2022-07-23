import { Snowflake } from "discord-api-types/globals"
import { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10"
import { User } from "shared"
import { TLRU } from "tlru"
import { Resolver } from "../../../utils"

const userGuildsCache = new TLRU<Snowflake, RESTGetAPICurrentUserGuildsResult>()

const getGuilds = async (user: User) => {}

export const getGuildList: Resolver<any> = () => {
  return null
}
