import { Extension, listener } from "@pikokr/command.ts"
import { Message } from "discord.js"

class CensorModule extends Extension {
  @listener({ event: "messageCreate" })
  messageCreate(msg: Message) {
    console.log(msg.content)
  }
}

export const setup = () => {
  return new CensorModule()
}
