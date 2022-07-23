import { RuleType } from "@prisma/client"
import { ChannelType } from "discord-api-types/v10"

export type YPUser = {
  id: string
  username: string
  discriminator: string
  tag: string
  avatar: string
}

export type YPGuild = {
  id: string
  name: string

  invited: boolean
}

export type YPChannel = {
  id: string
  name: string

  type: ChannelType
}

export type RuleElementInfo = {
  name: string
  ruleType: RuleType
  regex: string
  separate: boolean
}
