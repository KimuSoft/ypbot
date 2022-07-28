import {
  applicationCommand,
  Extension,
  listener,
  moduleHook,
  option,
} from "@pikokr/command.ts"
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  codeBlock,
  Colors,
  EmbedBuilder,
  GuildBasedChannel,
  GuildMember,
  Interaction,
  Message,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
  TextBasedChannel,
} from "discord.js"
import hangul from "hangul-js"
import { prisma, Rule, RuleType } from "shared"
import { YPClient } from "../structures/YPClient"
import fs from "fs"
import path from "path"
import { sqlDir } from "../utils"
import { captureException } from "@sentry/node"

class CensorModule extends Extension {
  @listener({ event: "messageUpdate" })
  async messageUpdate(oldMsg: Message, newMsg: Message) {
    return this.messageCreate(newMsg)
  }

  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "알림채널",
    description: "알림채널 설정",
    dmPermission: false,
  })
  async setNotificationChannel(
    i: ChatInputCommandInteraction,
    @option({
      type: ApplicationCommandOptionType.Subcommand,
      name: "설정",
      description: "알림 채널을 설정합니다",
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "채널",
          description: "알림 채널로 설정할 채널",
          required: true,
          channel_types: [
            ChannelType.GuildText,
            ChannelType.GuildNews,
            ChannelType.GuildVoice,
          ],
        },
      ],
    })
    set: boolean,
    @option({
      type: ApplicationCommandOptionType.Subcommand,
      name: "초기화",
      description: "알림 채널 설정을 초기화합니다",
    })
    reset: boolean
  ) {
    if (!i.guildId || !i.member) return

    if (!(i.member as GuildMember).permissions.has("Administrator"))
      return i.reply("?")

    if (set) {
      const channel = i.options.getChannel("채널") as GuildBasedChannel
      await prisma.guild.upsert({
        where: { id: i.guildId },
        create: {
          id: i.guildId,
          alertChannelId: channel.id,
        },
        update: {
          alertChannelId: channel.id,
        },
      })
      await i.reply("수정 완료!")
    } else if (reset) {
      await prisma.guild.updateMany({
        where: {
          id: i.guildId,
        },
        data: {
          alertChannelId: null,
        },
      })
      await i.reply("수정 완료!")
    } else {
      await i.reply("?")
    }
  }

  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "규칙",
    description: "이 채널에 적용된 규칙 목록을 보여줍니다.",
    dmPermission: false,
  })
  async tags(i: ChatInputCommandInteraction) {
    let channel = i.channel
    if (!channel) return
    if (channel.isThread()) channel = channel.parent
    if (!channel) return
    if (channel.isDMBased()) return i.reply("DM 안 받아요")

    const ypChannel = await prisma.channel.findUnique({
      where: { id: channel.id },
      include: { rules: true },
    })

    const ypGuild = await prisma.guild.findUnique({
      where: { id: i.guildId! },
      include: { commonRules: true },
    })

    if (!ypChannel?.rules.length && !ypGuild?.commonRules.length)
      return i.reply("위브에 등록되지 않은 채널입니다.")

    const rules: Rule[] = []

    if (ypChannel?.rules) rules.push(...ypChannel.rules)

    if (ypGuild?.commonRules) rules.push(...ypGuild.commonRules)

    const select = new SelectMenuBuilder()
      .setOptions(
        rules.map((rule) => {
          return {
            label: rule.name,
            description: rule.description,
            value: rule.id,
            emoji: rule.isOfficial ? "📕" : "📙",
          }
        })
      )
      .setPlaceholder(`⚖️ ${channel.name} 채널의 규칙`)
      .setCustomId("ruleList")

    await i.reply({
      components: [new ActionRowBuilder().setComponents(select) as any],
    })
  }

  @listener({ event: "interactionCreate" })
  async interaction(i: Interaction) {
    if (!i.isSelectMenu()) return

    if (i.customId !== "ruleList") return

    return i.deferUpdate()
  }

  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "관리",
    description: "관리 페이지로 이동합니다",
    dmPermission: false,
  })
  async manage(i: ChatInputCommandInteraction) {
    if (!i.guild) return
    const member = await i.guild.members.fetch(i.user.id)

    if (!member.permissions.has("Administrator"))
      return i.reply({
        content: "관리자만 사용 가능한 명령어에요!",
        ephemeral: true,
      })

    return i.reply({
      components: [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setURL(`${process.env.FRONTEND_BASE_URL}/app/guilds/${i.guildId}`)
            .setStyle(ButtonStyle.Link)
            .setLabel("관리페이지 링크")
            .setEmoji("🔗")
        ),
      ],
    })
  }

  @listener({ event: "messageCreate" })
  async dokdo(msg: Message) {
    ;(this.commandClient as YPClient).dokdo.run(msg)
  }

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
}

export const setup = () => {
  return new CensorModule()
}
