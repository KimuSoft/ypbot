import { gql } from "apollo-server"

export const typeDefs = gql`
  type User {
    id: String!
  }

  type Query {
    me: User
  }
`
