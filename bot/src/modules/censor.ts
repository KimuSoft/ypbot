import { Extension, listener, moduleHook } from "@pikokr/command.ts"
import {
  codeBlock,
  Colors,
  EmbedBuilder,
  Message,
  TextBasedChannel,
} from "discord.js"
import hangul from "hangul-js"
import { prisma, Rule, RuleType } from "shared"
import fs from "fs"
import path from "path"
import { sqlDir } from "../utils"
import { captureException } from "@sentry/node"

class CensorModule extends Extension {
  private findRuleSql!: string

  @moduleHook("load")
  async load() {
    this.findRuleSql = (
      await fs.promises.readFile(path.join(sqlDir, "findRule.sql"))
    ).toString()
  }

  @listener({ event: "messageCreate" })
  async messageCreate(msg: Message) {
    try {
      if (msg.author.bot || msg.author.id === this.client.user?.id) return
      if (!msg.guild) return

      const originalContent = msg.content
        .normalize()
        .replace(/[!?@#$%^&*():;+-=~{}<>_\[\]|\\"',.\/`₩\s\t\d]/g, "")

      if (!originalContent) return

      let chn = msg.channel.id

      if (msg.channel.isThread()) chn = msg.channel.parentId!

      const matches = await prisma.$queryRawUnsafe<
        {
          separate: boolean
          id: string
          regex: string
          name: string
          ruleType: RuleType
          ruleId: string
          ruleName: string
        }[]
      >(
        this.findRuleSql,
        chn,
        msg.guild.id,
        hangul.disassembleToString(originalContent),
        originalContent
      )

      if (!matches.length) return
      if (!msg.deletable) return
      ;(global as any).stats.censorCount++

      // 규칙을 위반한 메시지 삭제
      await msg.delete()

      const rule = matches[0]

      const regex = new RegExp(rule.regex, "g")

      const normalizedContent = msg.content.normalize()

      const regexMatches = normalizedContent.matchAll(regex)

      let content = ""

      let lastIndex = 0

      // function that remove symbols from the string and korean is not symbol
      // const removeSymbols = (str: string) => {
      //   return str
      //     .replace(
      //       /[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\u0020]/g,
      //       ""
      //     )
      //     .replace(
      //       /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/g,
      //       ""
      //     )
      // }

      for (const match of regexMatches) {
        if (match.index === undefined || match.input === undefined) return

        content += normalizedContent.slice(lastIndex, match.index)

        content += `\u001b[31m${match[0]}\u001b[0m`

        lastIndex = match.index + match[0].length
      }

      content += normalizedContent.slice(lastIndex)

      if (content === normalizedContent && rule.ruleType === "Black") {
        let newContent: string = ""
        const c = rule.separate
          ? hangul.disassembleToString(originalContent)
          : originalContent
        const regexMatches2 = c.matchAll(regex)
        for (const match of regexMatches2) {
          if (match.index === undefined || match.input === undefined) return

          newContent += c.slice(lastIndex, match.index)

          newContent += `\u001b[31m${match[0]}\u001b[0m`

          lastIndex = match.index + match[0].length
        }

        if (c !== newContent) {
          newContent += c.slice(lastIndex)
          content += `\n-----------------------------------------------\n→ ${newContent}`
        }
      }

      // 키뮤식 구현
      // const matchContent = msg.content.match(regex)
      // if (matchContent && matchContent.length) {
      //   const regexKimu = new RegExp(`(${rule.regex})`, "g")
      //   content = content.replace(regexKimu, "**$1**")
      //   content = content.replace(/\*{4}/g, "")
      // }

      // 알림 메시지 생성
      // const firstMatchRule = matches[0]
      // const matchStrings = msg.content.match(firstMatchRule.regex)
      // let matchStr: string | null = null
      // if (matchStrings && matchStrings.length) {
      //   matchStr = matchStrings[0]
      // }

      const alertEmbed = new EmbedBuilder()
        .setAuthor({
          iconURL: msg.author.displayAvatarURL(),
          name: msg.author.tag,
        })
        .setTimestamp()

      alertEmbed.setDescription(codeBlock("ansi", content))
      alertEmbed
        .setFooter({
          text: `\`${rule.name}\`을(를) ${
            rule.ruleType === "Black" ? "말했습니다." : "말하지 않았습니다."
          }`,
        })
        .setColor(Colors.Red)

      const g = await prisma.guild.findUnique({
        where: { id: msg.guild.id },
        select: { alertChannelId: true },
      })

      const ch =
        (msg.guild.channels.cache.get(
          g?.alertChannelId as string
        ) as TextBasedChannel) ?? msg.channel

      await ch.send({
        content: `${msg.author}님이 ${msg.channel}에서 \`${rule.ruleName}\` 규칙을 위반하셨습니다.`,
        embeds: [alertEmbed],
      })
    } catch (e) {
      console.error(e)
      captureException(e)
    }
  }

  @listener({ event: "messageUpdate" })
  async messageUpdate(oldMsg: Message, newMsg: Message) {
    return this.messageCreate(newMsg)
  }
}

export const setup = () => {
  return new CensorModule()
}
