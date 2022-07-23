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

  type Guild {
    id: String!
    name: String!
    icon: String

    invited: Boolean

    channels: [Channel!]!
  }

  type Channel {
    id: String!
    name: String!

    type: Int
  }

  type Rule {
    id: String!
  }

  type Query {
    me: User

    loginUrl: String!

    guilds: [Guild!]!
  }

  type Mutation {
    login(code: String!): String
  }
`
