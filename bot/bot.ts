import { Client } from 'discord.js'

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
})

export { client }
