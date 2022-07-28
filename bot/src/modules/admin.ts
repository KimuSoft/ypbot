import { applicationCommand, Extension, option } from "@pikokr/command.ts"
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  GuildBasedChannel,
  GuildMember,
  MessageActionRowComponentBuilder,
} from "discord.js"
import { prisma, RuleType } from "shared"

class AdminModule extends Extension {
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
}

export const setup = () => {
  return new AdminModule()
}
