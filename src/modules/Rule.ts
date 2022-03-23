import { listener, Module } from '@pikokr/command.ts'
import { Message } from 'discord.js'
import db from '../utils/db'
import parseRegex from 'regex-parser'

class Rule extends Module {
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

        const rules = await db.rule.findMany({
            where: {
                channels: {
                    some: {
                        id: msg.channelId,
                    },
                },
            },
            include: {
                elements: true,
            },
        })

        if (!rules.length) return

        const checkRule = async (rule: any) => {
            for (const element of rule.elements) {
                let isWrong: boolean = false
                const regex = parseRegex(element.regex)

                if (!this.isValidRegex(element.regex)) continue
                switch (element.ruleType) {
                    case 'Black':
                        isWrong = regex.test(msg.content)
                        break
                    case 'White':
                        isWrong = !regex.test(msg.content)
                        break
                    case 'Include':
                        await checkRule(
                            await db.rule.findUnique({
                                where: {
                                    id: element.includedRuleId!,
                                },
                                include: {
                                    elements: true,
                                },
                            })
                        )
                        break
                }

                if (isWrong) return msg.delete()
            }
        }

        for (const rule of rules) {
            await checkRule(rule)
        }
    }
}

export function install() {
    return new Rule()
}
