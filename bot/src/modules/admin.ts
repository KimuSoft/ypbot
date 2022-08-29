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
    name: "alert_channel",
    nameLocalizations: {
      ko: "알림채널",
    },
    description: "Setting notification channel",
    descriptionLocalizations: {
      ko: "알림채널 설정 관련 명령어예요.",
    },
    dmPermission: false,
  })
  async setNotificationChannel(
    i: ChatInputCommandInteraction,
    @option({
      type: ApplicationCommandOptionType.Subcommand,
      name: "set",
      name_localizations: {
        ko: "설정",
      },
      description: "Set the channel on which notifications will be posted",
      description_localizations: {
        ko: "알림 채널을 설정합니다",
        ja: "通知チャンネルを設定します。",
        "zh-TW": "配置通知信道 。",
        "zh-CN": "配置通知信道 。",
      },
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          name_localizations: {
            ko: "채널",
            ja: "チャンネル",
            "zh-TW": "通道",
            "zh-CN": "渠道",
          },
          description: "The channel on which notifications are posted",
          description_localizations: {
            ko: "알림 채널로 설정할 채널",
            ja: "通知チャンネルに設定するチャンネル",
            "zh-TW": "設置爲通知信道的信道",
            "zh-CN": "设置为通知信道的信道",
          },
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
      name: "reset",
      name_localizations: {
        ko: "초기화",
      },
      description: "Initialize notification channel setting",
      description_localizations: {
        ko: "알림 채널 설정을 초기화합니다.",
        ja: "通知チャンネルの設定を初期化します。",
        "zh-TW": "重置通知信道設置 。",
        "zh-CN": "重置通知信道设置 。",
      },
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
    name: "admin",
    nameLocalizations: {
      ko: "관리",
    },
    description: "Get link of dashboard",
    descriptionLocalizations: {
      ko: "서버 규칙 관리 페이지로 이동합니다.",
      ja: "サーバールール管理ページに移動します。",
      "zh-TW": "轉到服務器規則管理頁面 。",
      "zh-CN": "转到服务器规则管理页面 。",
    },
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
