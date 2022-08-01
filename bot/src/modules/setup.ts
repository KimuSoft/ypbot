import { applicationCommand, Extension, ownerOnly } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js"
import { prisma, RuleType } from "shared"
import _officialRules from "../officialRules.json"

class SetupModule extends Extension {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "공식태그재설치",
    description: "호애액",
    dmPermission: false,
    guilds: (process.env.DEV_GUILD || "").split(":"),
  })
  @ownerOnly
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

    await prisma.rule.deleteMany({
      where: {
        isOfficial: true,
        name: {
          notIn: officialRules.map((x) => x.name),
        },
      },
    })

    for (const rule of officialRules) {
      const r = await prisma.rule.findFirst({
        where: {
          isOfficial: true,
          name: rule.name,
        },
      })
      if (r) {
        await prisma.ruleElement.deleteMany({
          where: {
            ruleId: r.id,
          },
        })
        await prisma.rule.update({
          where: {
            id: r.id,
          },
          data: {
            elements: {
              createMany: {
                skipDuplicates: true,
                data: rule.elements.map((x) => ({
                  name: x.name,
                  regex: x.regex,
                  ruleType: x.ruleType as RuleType,
                })),
              },
            },
          },
        })
      } else {
        await prisma.rule.create({
          data: {
            name: rule.name,
            description: rule.description,
            authorId: i.user.id,
            isOfficial: true,
            elements: {
              createMany: {
                skipDuplicates: true,
                data: rule.elements.map((x) => ({
                  name: x.name,
                  regex: x.regex,
                  ruleType: x.ruleType as RuleType,
                })),
              },
            },
          },
        })
      }
    }

    await i.editReply({
      content: "꺄앙",
    })
  }
}

export const setup = () => {
  return new SetupModule()
}
