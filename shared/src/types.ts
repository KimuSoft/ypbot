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
