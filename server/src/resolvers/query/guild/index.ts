import { getAlertChannel } from "./alertChannel"
import { getGuildChannels } from "./channels"

export const guildResolvers = {
  channels: getGuildChannels,
  alertChannel: getAlertChannel,
}
