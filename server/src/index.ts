import dotenv from "dotenv"
import path from "path"
import fs from "fs"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
})

dotenv.config({
  path: path.join(__dirname, "../../shared/.env"),
})

import { ApolloServer } from "apollo-server-express"
import { logger } from "./logger"
import { resolvers } from "./resolvers"
import { typeDefs } from "./schema"
import { prisma, User } from "shared"
import jwt from "jsonwebtoken"
import { jwtToken } from "./utils"
import express from "express"
import { rpc } from "./trpc"

process.on("uncaughtException", console.error)
process.on("unhandledRejection", console.error)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  context: async (ctx) => {
    let user: User | null = null

    if (ctx.req.headers.authorization?.startsWith("Bearer ")) {
      const token = ctx.req.headers.authorization.slice("Bearer ".length)

      try {
        const { id } = jwt.verify(token, jwtToken()) as {
          id: string
        }

        user = await prisma.user.findUnique({ where: { id } })
      } catch (e) {
        user = null
      }
    }

    return { user }
  },
})

const app = express()

app.use(express.static(path.join(__dirname, "../static")))

app.get("/metrics", async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.METRICS_TOKEN}`)
    return res.sendStatus(401)
  try {
    const memoryUsage = {
      server_memory_usage: process.memoryUsage().rss,
    }

    const metrics: Record<string, any> = {
      ...(await rpc.query("stats")),
      ...memoryUsage,
    }

    res.send(
      Object.entries(metrics)
        .map(([k, v]) => `ypbot_${k} ${v}`)
        .join("\n")
    )
  } catch (e) {
    return res.send("")
  }
})

const run = async () => {
  await server.start()
  server.applyMiddleware({ app })

  const file = "frontend/build/handler.js"

  if (fs.existsSync(path.join(__dirname, "../../frontend/build/handler.js"))) {
    const { handler } = await eval(`import(${JSON.stringify(file)})`)

    app.use(handler)

    logger.info("registered frontend middleware")
  }

  await new Promise<void>((resolve) =>
    app.listen(process.env.PORT || 4000, resolve)
  )
  logger.info(
    `Apollo server is ready at http://localhost:${process.env.PORT || 4000}/`
  )
}

run().then()
