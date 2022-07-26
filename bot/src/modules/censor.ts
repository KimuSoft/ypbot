import { Extension, listener } from "@pikokr/command.ts"
import { codeBlock, Message } from "discord.js"
import hangul from "hangul-js"
import { prisma, RuleType } from "shared"

class CensorModule extends Extension {
  @listener({ event: "messageCreate" })
  async messageCreate(msg: Message) {
    if (msg.author.bot || msg.author.id === this.client.user?.id) return
    const matches = await prisma.$queryRaw<
      {
        separate: boolean
        id: string
        regex: string
        name: string
        ruleType: RuleType
        ruleId: string
        ruleName: string
      }[]
    >`
    with rule_types
      as (select el."separate",
            el."id",
            el."regex",
            el."name",
            el."ruleType",
            el."ruleId",
            case el."separate"
              when TRUE then ${hangul.disassembleToString(msg.content)}
              else ${msg.content}
            end as  "_Input"
          from   "RuleElement" as el)
        select el.*, el."name" as "ruleName"
        from rule_types el
        right join "Rule" r on el."ruleId" = r."id"
        where (
          ("ruleType" = 'Black' :: "RuleType" and "_Input" ~* "regex") or 
          ("ruleType" = 'White' :: "RuleType" and not "_Input" ~* "regex") ) and exists 
          (select from "__ruleOnChannel" where "A" = ${
            msg.channel.id
          } and "B" = "ruleId"
        );`

    if (matches.length) {
      if (msg.deletable) {
        await msg.delete()
        await msg.channel.send(
          codeBlock("diff", matches.map((x) => `- ${x.ruleName}`).join("\n"))
        )
      }
    }
  }
}

export const setup = () => {
  return new CensorModule()
}
