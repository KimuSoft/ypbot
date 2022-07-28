import { Extension, listener } from "@pikokr/command.ts"
import { captureException } from "@sentry/node"
import {
  codeBlock,
  CommandInteraction,
  EmbedBuilder,
  inlineCode,
  Message,
} from "discord.js"
import { logger } from "../utils"
import { YPClient } from "../structures/YPClient"

class ErrorHandler extends Extension {
  @listener({ event: "applicationCommandInvokeError", emitter: "cts" })
  async onCommandError(e: Error, i: CommandInteraction) {
    const eventId = captureException(e)

    await (i.deferred || i.replied ? i.followUp : i.reply).bind(i)({
      embeds: [
        new EmbedBuilder()
          .setTitle("오류 발생")
          .setDescription(
            `${codeBlock(e.message)}\nEvent id: ${inlineCode(eventId)}`
          ),
      ],
    })

    logger.error(e)
  }

  @listener({ event: "messageCreate" })
  async dokdo(msg: Message) {
    ;(this.commandClient as YPClient).dokdo.run(msg).then()
  }
}

export const setup = () => {
  return new ErrorHandler()
}
