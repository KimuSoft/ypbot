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
