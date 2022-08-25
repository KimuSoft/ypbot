import { applicationCommand, Extension, ownerOnly } from "@pikokr/command.ts"
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Client,
  Options,
  Partials,
} from "discord.js"
import path from "path"
import { YPClient } from "./structures/YPClient"
import { logger } from "./utils"
import * as Sentry from "@sentry/node"
import "@sentry/tracing"

process.on("uncaughtException", (err) => {
  logger.error(err)
})
process.on("unhandledRejection", (err) => {
  logger.error(err)
})

if (process.env.BOT_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.BOT_SENTRY_DSN,
    tracesSampleRate: 1.0,
  })
}

class DevModule extends Extension {
  @ownerOnly
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "reload",
    description: "reload modules",
    guilds: (process.env.DEV_GUILD || "").split(":"),
  })
  async reload(i: ChatInputCommandInteraction) {
    await i.deferReply()

    const results = await cts.cluster.broadcastEval(
      "global.cts.registry.reloadModules()"
    )

    await i.editReply(
      results
        .map(
          (result: any[], index) =>
            `Cluster #${index} - Succeed: ${
              result.filter((x) => x.result).length
            } Error: ${result.filter((x) => !x.result).length}`
        )
        .join("\n")
    )
  }
}

export const client = new Client({
  intents: ["MessageContent", "Guilds", "DirectMessages", "GuildMessages"],
  partials: [
    Partials.User,
    Partials.ThreadMember,
    Partials.Channel,
    Partials.GuildMember,
  ],
  makeCache: Options.cacheWithLimits({
    MessageManager: 0,
    PresenceManager: 0,
    UserManager: 0,
  }),
})

export const cts = new YPClient(client, logger)

const setGlobal = (key: string, value: unknown) => {
  ;(global as Record<string, unknown>)[key] = value
}

setGlobal("stats", { censorCount: 0 })

setGlobal("cts", cts)

const start = async () => {
  await cts.enableApplicationCommandsExtension({
    guilds: process.env.COMMAND_GUILDS
      ? process.env.COMMAND_GUILDS.split(":")
      : undefined,
  })

  await cts.registry.loadAllModulesInDirectory(path.join(__dirname, "modules"))

  await cts.registry.registerModule(new DevModule())

  await client.login(process.env.DISCORD_BOT_TOKEN)

  logger.info(`Logged in as ${client.user!.tag}`)

  await cts.fetchOwners()

  await cts.getApplicationCommandsExtension()!.sync()
}

start().then()
