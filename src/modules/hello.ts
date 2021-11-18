import { listener, Module, slashCommand } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

class Hello extends Module {
    constructor(private cts: Client) {
        super()
    }

    @slashCommand({
        command: new SlashCommandBuilder().setName('test').setDescription('호애애'),
    })
    async test(i: CommandInteraction) {
        await i.reply({
            content: '호애애애애',
            ephemeral: true,
        })
    }

    @listener('ready')
    ready() {
        console.log(`Logged in as ${this.cts.client.user!.tag}`)
    }
}

export function install(cts: Client) {
    return new Hello(cts)
}
