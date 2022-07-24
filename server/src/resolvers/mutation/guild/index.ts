import { getChannelMutation } from "./channels"

export const guildMutationResolvers = {
  channel: getChannelMutation,
}
