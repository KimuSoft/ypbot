import { Client } from "discord.js"
import { YPClient } from "./structures/YPClient"
import { logger } from "./utils"

export const client = new Client({
  intents: ["MessageContent", "Guilds", "DirectMessages"],
})

export const cts = new YPClient(client, logger)

const setGlobal = (key: string, value: unknown) => {
  ;(global as Record<string, unknown>)[key] = value
}

setGlobal("cts", cts)

const start = async () => {
  await client.login(process.env.DISCORD_BOT_TOKEN)

  logger.info(`Logged in as ${client.user!.tag}`)
}

start().then()
