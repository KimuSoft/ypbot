import { CommandClient } from '@pikokr/command.ts'
import { logger } from '../logger'
import type { Client } from 'discord.js'

export class Bot extends CommandClient {
  constructor(client: Client) {
    super({
      client,
      logger,
      applicationCommands: {
        autoSync: process.env.NODE_ENV !== 'production',
        guild: process.env.COMMAND_GUILD,
      },
    })

    this.registry.loadModulesIn('modules')
  }
}
