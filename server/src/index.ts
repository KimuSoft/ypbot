import dotenv from "dotenv"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
  override: true,
})

import { ApolloServer } from "apollo-server"
import { logger } from "./logger"
import { resolvers } from "./resolvers"
import { typeDefs } from "./schema"
import path from "path"
import { prisma, User } from "shared"
import jwt from "jsonwebtoken"
import { jwtToken } from "./utils"

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

const run = async () => {
  const { url } = await server.listen(process.env.PORT || 4000)
  logger.info(`Apollo server is ready at ${url}`)
}

run().then()
