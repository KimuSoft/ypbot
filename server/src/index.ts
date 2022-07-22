import { ApolloServer } from "apollo-server"
import { logger } from "./logger"
import { resolvers } from "./resolvers"
import { typeDefs } from "./schema"

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
})

server.listen(process.env.PORT || 4000).then(({ url }) => {
  logger.info(`Apollo server is ready at ${url}`)
})
