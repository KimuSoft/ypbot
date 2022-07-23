import { mutationResolvers } from "./mutation"
import { queryResolvers } from "./query"

export const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
}
