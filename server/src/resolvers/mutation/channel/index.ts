import { addRuleToChannel } from "./addRule"
import { removeRuleFromChannel } from "./removeRule"

export const channelMutationResolvers = {
  addRule: addRuleToChannel,
  removeRule: removeRuleFromChannel,
}
