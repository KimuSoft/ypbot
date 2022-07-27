import { Extension, listener } from "@pikokr/command.ts"
import { captureException } from "@sentry/node"
import {
  codeBlock,
  CommandInteraction,
  EmbedBuilder,
  inlineCode,
} from "discord.js"
import { logger } from "../utils"

class ErrorHandler extends Extension {
  @listener({ event: "applicationCommandInvokeError", emitter: "cts" })
  async onCommandError(e: Error, i: CommandInteraction) {
    const eventId = captureException(e)

    await (i.deferred || i.replied ? i.editReply : i.reply).bind(i)({
      content: "",
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
}

export const setup = () => {
  return new ErrorHandler()
}
