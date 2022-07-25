import { Extension, listener } from "@pikokr/command.ts"
import { Message } from "discord.js"
import { prisma, RuleType } from "shared"

class CensorModule extends Extension {
  @listener({ event: "messageCreate" })
  async messageCreate(msg: Message) {
    const black = await prisma.$queryRaw`SELECT * 
                            FROM "RuleElement" WHERE ${msg.content} ~* regex AND "ruleType" = ${RuleType.Black}::RuleType AND EXISTS 
                            (SELECT FROM "__ruleOnChannel" WHERE "A" = ${msg.channel.id} AND "B" = "ruleId")`
    console.log(black)
  }
}

export const setup = () => {
  return new CensorModule()
}
