import { CommandClient } from '@pikokr/command.ts'
import Discord, { Intents, IntentsString, Message } from 'discord.js'
import { config } from '../config'
import chokidar from 'chokidar'
import * as path from 'path'
import { KModulePath } from '@pikokr/command.ts/dist/constants'
import chalk from 'chalk'
import * as fs from 'fs'
import { log } from '@blitzjs/display'
import { restartServer } from '../webManager'
import Dokdo from 'dokdo'

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

        watcher.on('change', async (path1) => {
            if (path1.startsWith(path.join(require.main!.path, 'modules'))) {
                try {
                    const mod = this.registry.modules.find((x) => Reflect.getMetadata(KModulePath, x) === path1)
                    if (!mod) {
                        await this.registry.loadModule(path1, true)
                    } else {
                        await this.registry.reloadModule(mod)
                    }

                    log.success(`Reloaded module ${chalk.bold(path1)}`)
                } catch (e: any) {
                    log.error(`Failed to reload module ${chalk.bold(path1)}`)
                }
                return
            }
            if (path1.startsWith(path.join(require.main!.path, 'web'))) {
                try {
                    await restartServer()
                } catch (e) {
                    console.error(e)
                }
                return
            }
            const mod = require.cache[require.resolve(path1)]
            if (mod) {
                const f = (await fs.readFileSync(path1)).toString()
                if (f.startsWith('// reloadable')) {
                    delete require.cache[require.resolve(path1)]
                    log.success(`Module cache deleted - ${mod.filename}`)
                }
            }
        })
    }

    async ready(): Promise<void> {
        await super.ready()
        const dokdo = new Dokdo(this.client, {
            owners: this.owners,
            noPerm(): any {},
            prefix: this.options.command.prefix as string,
        })

        this.client.on('messageCreate', (msg) => dokdo.run(msg))
    }
}
