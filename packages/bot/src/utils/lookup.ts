import Eris, { Channel, ChannelTypes, Constants, Guild } from 'eris'

import { rpc } from './rpc.js'

const transformGuild = (guild: Guild) => {
  return {
    id: guild.id,
    name: guild.name,
  }
}

export const lookupEvents = (eris: Eris.Client) => {
  rpc.on('lookupGuilds', (id: string[], cb) => {
    const res: Guild[] = []

    for (const g of id) {
      const guild = eris.guilds.get(g)

      if (guild) res.push(guild)
    }

    cb(res.map(transformGuild))
  })

  rpc.on('lookupGuild', (id: string, cb) => {
    const guild = eris.guilds.get(id)

    cb(guild ? transformGuild(guild) : null)
  })

  rpc.on('lookupGuildChannels', (id: string, cb) => {
    const guild = eris.guilds.get(id)

    if (!guild) return cb(null)

    const categories = guild.channels
      .filter((x) => x.type === Constants.ChannelTypes.GUILD_CATEGORY)
      .map((x) => ({
        id: x.id,
        name: x.name,
        position: x.position,
      }))

    console.log(categories)

    cb([])
  })
}
