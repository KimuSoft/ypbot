import * as trpc from "@trpc/client"
import type { RPC } from "bot"
import fetch from "node-fetch"
import dotenv from "dotenv"
import path from "path"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
})

export const rpc = trpc.createTRPCClient<RPC>({
  url: `http://${process.env.BOT_RPC_HOST || "127.0.0.1"}:${
    process.env.BOT_RPC_PORT
  }/rpc`,
  fetch: fetch as unknown as typeof global.fetch,
})
