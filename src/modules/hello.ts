import { listener, Module } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { log } from '@blitzjs/display'

class Hello extends Module {
    constructor(private cts: Client) {
        super()
    }

    @listener('ready')
    ready() {
        log.success(`Logged in as ${this.cts.client.user!.tag}`)
    }
}

export function install(cts: Client) {
    return new Hello(cts)
}
