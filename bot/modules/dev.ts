import { applicationCommand, Module } from '@pikokr/command.ts'
import type { CommandInteraction } from 'discord.js'

class Dev extends Module {
  @listener('interactionCreate')
  async dfnsdfwioefjeijfi() {
    console.log('asdf')
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: 'reload',
      description: 'reload',
    },
  })
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
