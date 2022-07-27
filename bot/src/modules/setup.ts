import { applicationCommand, Extension } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js"
import { prisma } from "shared"
import _officialRules from "../officialRules.json"

class SetupModule extends Extension {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "공식태그재설치",
    description: "호애액",
    dmPermission: false,
    guilds: (process.env.DEV_GUILD || "").split(":"),
  })
  async officialTagInstall(i: ChatInputCommandInteraction) {
    interface RuleElement {
      name: string
      regex: string
      ruleType: string // "Black" | "White"
      separate?: boolean
    }

    interface Rule {
      name: string
      description: string
      elements: RuleElement[]
    }

    await i.deferReply()

    const officialRules: Rule[] = _officialRules

    await prisma.rule.deleteMany({ where: { isOfficial: true } })
    await prisma.rule.createMany({
      data: officialRules.map((rule) => {
        return {
          name: rule.name,
          description: rule.description,
          authorId: i.user.id,
          elements: { create: rule.elements },
        }
      }),
    })

    await i.editReply({
      content: "꺄앙",
    })
  }
}

export const setup = () => {
  return new SetupModule()
}
