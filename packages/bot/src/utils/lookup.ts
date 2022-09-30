import Eris, { Channel, ChannelTypes, Constants, Guild, GuildTextableChannel } from 'eris'
import _ from 'lodash'

import { rpc } from './rpc.js'

const transformGuild = (guild: Guild) => {
  return {
    id: guild.id,
    name: guild.name,
  }
}

const transformChannel = (channel: GuildTextableChannel) => {
  return {
    id: channel.id,
    name: channel.name,
    type: channel.type,
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

    const categories = _.sortBy(
      guild.channels.filter((x) => x.type === Constants.ChannelTypes.GUILD_CATEGORY),
      'position'
    ).map((x) => ({
      id: x.id,
      name: x.name,
      channels: [] as ReturnType<typeof transformChannel>[],
    }))

    for (const category of categories) {
      category.channels = _.sortBy(
        guild.channels.filter(
          (x) =>
            x.parentID === category.id &&
            (
              [
                Constants.ChannelTypes.GUILD_TEXT,
                Constants.ChannelTypes.GUILD_VOICE,
                Constants.ChannelTypes.GUILD_NEWS,
              ] as ChannelTypes[]
            ).includes(x.type)
        ) as GuildTextableChannel[],
        'position'
      ).map(transformChannel)
    }

    cb(categories)
  })
}
