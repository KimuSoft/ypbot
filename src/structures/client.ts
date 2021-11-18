import { CommandClient } from '@pikokr/command.ts'
import Discord, { Intents, IntentsString } from 'discord.js'
import { config } from '../config'

export class Client extends CommandClient {
    constructor() {
        super({
            client: new Discord.Client({
                intents: Object.keys(Intents.FLAGS) as IntentsString[],
            }),
            owners: 'auto',
            command: {
                prefix: '!!',
            },
            slashCommands: {
                autoSync: true,
                guild: config.slash.guild,
            },
        })

        this.registry.loadModulesIn('modules')
    }
}
