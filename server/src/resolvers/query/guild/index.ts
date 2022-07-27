import { getAlertChannel } from "./alertChannel"
import { getGuildChannels } from "./channels"
import { getCommonRules } from "./rules"

export const guildResolvers = {
  channels: getGuildChannels,
  alertChannel: getAlertChannel,
  commonRules: getCommonRules,
}
