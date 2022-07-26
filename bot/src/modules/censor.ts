import { Extension, listener } from "@pikokr/command.ts"
import { codeBlock, EmbedBuilder, Message } from "discord.js"
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
        ) limit 1;`

    if (!matches.length) return
    if (!msg.deletable) return

    // 규칙을 위반한 메시지 삭제
    await msg.delete()

    const rule = matches[0]

    const regex = new RegExp(rule.regex, "g")

    const regexMatches = msg.content.matchAll(regex)

    let content = msg.content

    let indexToAdd = 0

    for (const match of regexMatches) {
      if (!match.index) continue
      let adjustedIndex = match.index + indexToAdd
      content =
        content.slice(0, adjustedIndex) +
        "**" +
        content.slice(adjustedIndex, adjustedIndex + match.length) +
        "**" +
        content.slice(adjustedIndex, match.length)
      indexToAdd += 4
    }

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
    alertEmbed.setFooter({
      text: `\`${rule.ruleName}\`을(를) ${
        rule.ruleType === "Black" ? "말했습니다." : "말하지 않았습니다."
      }`,
    })

    // 해당 서버의 알림 채널 정보 불러옴
    // const channelData = await prisma.$queryRaw<
    //   {
    //     alertChannelId: string
    //   }[]
    //   >`SELECT alertChannelId FROM "Channel" WHERE "id" = ${msg.channel.id};`
    // if(!channelData.length) return
    // const alertChannelId = channelData[0].alertChannelId

    await msg.channel.send(
      {
        content: `${msg.author}님께서 ${msg.channel}에서 \`${rule.ruleName}\` 규칙을 위반하셨습니다.`,
        embeds: [alertEmbed],
      }
      // codeBlock("diff", matches.map((x) => `- ${x.ruleName}`).join("\n"))
    )
  }
}

export const setup = () => {
  return new CensorModule()
}
