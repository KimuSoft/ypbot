import { Guild as DiscordGuild } from 'discord.js'
import db from './db'

export const getYPGuild = async (guild: DiscordGuild) => {
    return db.guild.upsert({
        where: {
            id: guild.id,
        },
        update: {},
        create: {
            id: guild.id,
        },
    })
}
