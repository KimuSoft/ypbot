import {
  applicationCommand,
  Module,
  ownerOnly,
} from '@pikokr/command.ts'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandInteraction } from 'discord.js'

class Dev extends Module {
  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: 'reload',
      description: 'reload',
    },
  })
  @ownerOnly
  async reload(i: CommandInteraction) {
    await i.deferReply()
    this.commandClient.registry
      .reloadAll()
      .then(() => i.editReply('ok'))
      .catch(() => i.editReply('error'))
  }
}

export function install() {
  return new Dev()
}
