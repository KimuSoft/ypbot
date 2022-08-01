import { applicationCommand, Extension, listener } from "@pikokr/command.ts"
import {
  ActionRowBuilder,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  Interaction,
  SelectMenuBuilder,
} from "discord.js"
import { prisma, Rule, RuleType } from "shared"

class RuleModule extends Extension {
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

    const rule = await prisma.rule.findUnique({
      where: { id: i.values[0] },
    })

    if (!rule)
      return i.reply({ content: "존재하지 않는 규칙입니다.", ephemeral: true })

    const embed = new EmbedBuilder()
      .setAuthor({ name: rule.isOfficial ? "📕  " : "📙  " + rule.name })
      .setDescription(rule.description)
      .setFooter({ text: "제작자 : " + rule.authorId })
      .setColor(rule.isOfficial ? Colors.Red : Colors.Gold)

    await i.update({ embeds: [embed] })
  }
}

export const setup = () => {
  return new RuleModule()
}
