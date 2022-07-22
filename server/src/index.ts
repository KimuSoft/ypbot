import dotenv from "dotenv"
import { ApolloServer } from "apollo-server"
import { logger } from "./logger"
import { resolvers } from "./resolvers"
import { typeDefs } from "./schema"
import path from "path"
import { prisma } from "shared"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
})

const run = async () => {
  const { url } = await server.listen(process.env.PORT || 4000)
  logger.info(`Apollo server is ready at ${url}`)
}

run().then()
