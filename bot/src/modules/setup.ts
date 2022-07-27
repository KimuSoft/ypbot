import { applicationCommand, Extension } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js"
import { prisma } from "shared"
// @ts-ignore
import officialBadWords from "../officialBadWords.json"

class SetupModule extends Extension {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "공식태그재설치",
    description: "호애액",
    dmPermission: false,
  })
  async officialTagInstall(i: ChatInputCommandInteraction) {
    interface RuleElement {
      name: string
      regex: string
      ruleType: "Black" | "White"
      separate?: boolean
    }

    interface Rule {
      name: string
      description: string
      elements: RuleElement[]
    }

    const officialBadWordsX: Rule[] = officialBadWords

    await prisma.rule.deleteMany({ where: { isOfficial: true } })
    await prisma.rule.createMany({
      data: officialBadWordsX.map((rule) => {
        return {
          name: rule.name,
          description: rule.description,
          authorId: i.user.id,
          elements: { create: rule.elements },
        }
      }),
    })

    await i.reply({
      content: "꺄앙",
    })
  }
}

export const setup = () => {
  return new SetupModule()
}
