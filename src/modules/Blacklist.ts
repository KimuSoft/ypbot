import { listener, Module } from '@pikokr/command.ts'
import { Message } from 'discord.js'
import db from '../utils/db'
import parseRegex from 'regex-parser'

class Blacklist extends Module {
    isValidRegex(s: string) {
        try {
            const m = s.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/)
            return m ? !!new RegExp(m[2], m[3]) : false
        } catch (e) {
            return false
        }
    }

    @listener('messageCreate')
    async messageCreated(msg: Message) {
        if (!msg.guild) return
        if (msg.author.bot) return
        if (!msg.channel.isText()) return
        const blacklists = await db.blackList.findMany({
            where: {
                guildId: msg.guild.id,
                channels: {
                    has: msg.channelId,
                },
            },
        })

        for (const blacklist of blacklists) {
            for (const word of blacklist.words) {
                if (this.isValidRegex(word)) {
                    const regex = parseRegex(word)

                    if (regex.test(msg.content)) {
                        await msg.delete()
                        return
                    }
                } else {
                    if (msg.content.toLowerCase().includes(word.toLowerCase())) {
                        await msg.delete()
                        return
                    }
                }
            }
        }
    }
}

export function install() {
    return new Blacklist()
}
