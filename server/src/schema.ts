import { gql } from "apollo-server"

export const typeDefs = gql`
  type User {
    id: String!
    username: String!
    discriminator: String!
    tag: String!
    avatar: String!

    rules: [Rule!]!
  }

  type Rule {
    id: String!
  }

  type Query {
    me: User

    loginUrl: String!
  }

  type Mutation {
    login(code: String!): String
  }
`
