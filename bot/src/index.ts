import dotenv from "dotenv"
import path from "path"
import * as trpc from "@trpc/server"
import { z } from "zod"
import fastify from "fastify"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import { logger } from "./utils"
import Cluster from "discord-hybrid-sharding"
import { ChannelType } from "discord.js"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
})

export type Guild = {
  id: string
  name: string
  channels: Channel[]
  perms: number
  icon?: string
}

export type Channel = {
  id: string
  name: string

  type: ChannelType

  guild: string

  parent: string | null

  position: number
}

const rpc = trpc.router().query("guilds", {
  input: z.array(z.string()),
  resolve: async ({ input }) => {
    const result = await manager.broadcastEval(
      `const guilds = ${JSON.stringify(input)};Promise.all(
        guilds
          .map((x) => cts.discord.guilds.cache.get(x))
          .filter((x) => x)
          .map(async (g) => {
            let me = g.members.me

            if (!me) {
                me = await g.members.fetchMe()
            }

            return {
              id: g.id,
              name: g.name,
              channels: g.channels.cache.filter(x => !${JSON.stringify([
                ChannelType.GuildNewsThread,
                ChannelType.GuildPublicThread,
                ChannelType.GuildPrivateThread,
              ])}.includes(x.type)).filter(x => ${JSON.stringify([
        ChannelType.GuildCategory,
        ChannelType.GuildForum,
        ChannelType.GuildNews,
        ChannelType.GuildText,
        ChannelType.GuildVoice,
      ])}.includes(x.type)).map(
                (x) => ({
                      id: x.id,
                      name: x.name,
                      type: x.type,
                      parent: x.parentId,
                      guild: g.id,
                      position: x.rawPosition
                    })
              ),
              perms: Number(me.permissions.bitfield),
              icon: g.iconURL({size: 512}),
            }
          })
      )`
    )

    return result.reduce((a, b) => [...a, ...b]) as Guild[]
  },
})

export type RPC = typeof rpc

const isTS = process.execArgv.includes("@swc-node/register")

const manager = new Cluster.Manager(
  path.join(__dirname, `bot.${isTS ? "ts" : "js"}`),
  {
    execArgv: isTS ? ["-r", "@swc-node/register"] : [],
    shardsPerClusters: 2,
    totalClusters: "auto",
    token: process.env.DISCORD_BOT_TOKEN!,
  }
)

manager.on("clusterCreate", (cluster) =>
  logger.info(`Launched cluster #${cluster.id}`)
)

const run = async () => {
  await manager.spawn({ timeout: -1 })

  logger.info(`Spawned all shards. Starting server...`)

  const server = fastify()

  server.register(fastifyTRPCPlugin, {
    prefix: "/rpc",
    trpcOptions: { router: rpc },
  })

  const addr = await server.listen({
    port: parseInt(process.env.BOT_RPC_PORT!),
    host: process.env.BOT_RPC_HOST || "127.0.0.1",
  })
  logger.info(`rpc server listening on ${addr}`)
}

run().then()
