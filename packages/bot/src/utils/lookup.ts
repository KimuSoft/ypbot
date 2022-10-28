import { rpc }                                                                                          from 'bot/src/utils/rpc.js'
import type { ChannelTypes, Guild, GuildTextableChannel, GuildTextChannelTypes, TextVoiceChannelTypes } from 'eris'
import type Eris                                                                                        from 'eris'
import { Constants }                                                                                    from 'eris'
import _                                                                                                from 'lodash'

const transformGuild = (guild: Guild): { id: string, name: string } => {
  return {
    id: guild.id,
    name: guild.name
  }
}

const transformChannel = (channel: GuildTextableChannel): {
  id: string
  name: string
  type: GuildTextChannelTypes | TextVoiceChannelTypes
} => {
  return {
    id: channel.id,
    name: channel.name,
    type: channel.type
  }
}

const whitelistedChannelTypes = [
  Constants.ChannelTypes.GUILD_TEXT,
  Constants.ChannelTypes.GUILD_VOICE,
  Constants.ChannelTypes.GUILD_NEWS
] as ChannelTypes[]

export const lookupEvents = (eris: Eris.Client): void => {
  rpc.on('lookupGuilds', (id: string[], cb) => {
    const res: Guild[] = []

    for (const g of id) {
      const guild = eris.guilds.get(g)

      if (guild != null) res.push(guild)
    }

    cb(res.map(transformGuild))
  })

  rpc.on('lookupGuild', (id: string, cb) => {
    const guild = eris.guilds.get(id)

    cb((guild != null) ? transformGuild(guild) : null)
  })

  rpc.on('lookupGuildChannels', (id: string, cb) => {
    const guild = eris.guilds.get(id)

    if (guild == null) return cb(null)

    const categories = _.sortBy(
      guild.channels.filter((x) => x.type === Constants.ChannelTypes.GUILD_CATEGORY),
      'position'
    ).map((x) => ({
      id: x.id,
      name: x.name,
      channels: [] as Array<ReturnType<typeof transformChannel>>
    }))

    for (const category of categories) {
      category.channels = _.sortBy(
        guild.channels.filter(
          (x) => x.parentID === category.id && whitelistedChannelTypes.includes(x.type)
        ) as GuildTextableChannel[],
        'position'
      ).map(transformChannel)
    }

    cb(categories)
  })

  rpc.on('lookupGuildChannel', (guildId: string, channelId: string, cb) => {
    const guild = eris.guilds.get(guildId)

    const channel = guild?.channels.get(channelId)

    if (channel == null) return cb(null)

    if (!whitelistedChannelTypes.includes(channel.type)) return cb(null)

    return cb(transformChannel(channel as GuildTextableChannel))
  })
}
