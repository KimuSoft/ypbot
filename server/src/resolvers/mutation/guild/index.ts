import { addRuleToGuild } from "./addRule"
import {
  getChannelMutation,
  resetAlertChannel,
  setAlertChannel,
} from "./channels"
import { removeRuleFromGuild } from "./removeRule"

export const guildMutationResolvers = {
  channel: getChannelMutation,
  setAlertChannel: setAlertChannel,
  resetAlertChannel: resetAlertChannel,
  addRule: addRuleToGuild,
  removeRule: removeRuleFromGuild,
}
