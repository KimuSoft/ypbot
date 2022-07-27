import {
  getChannelMutation,
  resetAlertChannel,
  setAlertChannel,
} from "./channels"

export const guildMutationResolvers = {
  channel: getChannelMutation,
  setAlertChannel: setAlertChannel,
  resetAlertChannel: resetAlertChannel,
}
