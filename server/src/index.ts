import dotenv from "dotenv"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
  override: true,
})

import { ApolloServer } from "apollo-server-express"
import { logger } from "./logger"
import { resolvers } from "./resolvers"
import { typeDefs } from "./schema"
import path from "path"
import { prisma, User } from "shared"
import jwt from "jsonwebtoken"
import { jwtToken } from "./utils"
import express from "express"

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

const run = async () => {
  await server.start()
  server.applyMiddleware({ app })
  await new Promise<void>((resolve) =>
    app.listen(
      process.env.PORT ? Number(process.env.PORT) : 4000,
      "0.0.0.0",
      resolve
    )
  )
  logger.info(
    `Apollo server is ready at http://localhost:${process.env.PORT || 4000}/`
  )
}

run().then()
