import { Client } from './structures/client'
import { config } from './config'

export const cts = new Client()

cts.client.login(config.token)
