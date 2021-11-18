import { CommandClient } from '@pikokr/command.ts'
import Discord, { Intents, IntentsString } from 'discord.js'
import { config } from '../config'
import chokidar from 'chokidar'
import * as path from 'path'
import { KModulePath } from '@pikokr/command.ts/dist/constants'
import chalk from 'chalk'
import * as fs from 'fs'

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

        const watcher = chokidar.watch(require.main!.path)

        watcher.on('change', async path1 => {
            if (path1.startsWith(path.join(require.main!.path,'modules'))) {
                try {
                    const mod = this.registry.modules.find(x=>Reflect.getMetadata(KModulePath, x) === path1)
                    if (!mod) {
                        await this.registry.loadModule(path1, true)
                    } else {
                        await this.registry.reloadModule(mod)
                    }
                    console.log(`[${chalk.green('SUCCESS')}] ${chalk.blueBright(path1)} - ${chalk.green('Success')}`)
                } catch (e: any) {
                    console.log(`[${chalk.redBright('ERROR')}] ${chalk.blueBright(path1)} - ${chalk.redBright(e.message)}`)
                }
                return
            }
            const mod = require.cache[require.resolve(path1)]
            if (mod) {
                const f = (await fs.readFileSync(path1)).toString()
                if (f.startsWith('// reloadable')) {
                }
            }
        })
    }
}
