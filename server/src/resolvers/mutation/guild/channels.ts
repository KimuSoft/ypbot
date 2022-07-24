import { Channel } from "bot"
import { YPChannel } from "shared"
import { Resolver } from "../../../utils"
import { FullGuild } from "../../query/guilds"

export const getChannelMutation: Resolver<
  (YPChannel & Channel) | null,
  FullGuild,
  { id: string }
> = (parent, { id }) => {
  return (
    (parent.channels as unknown[] as (YPChannel & Channel)[]).find(
      (x) => x.id === id
    ) || null
  )
}
