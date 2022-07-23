import { gql } from "apollo-server"

export const typeDefs = gql`
  type User {
    id: String!
    username: String!
    discriminator: String!
    tag: String!
    avatar: String!
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
    name: String!
    description: String!

    elements: [RuleElement!]!

    counts: RuleCounts!
  }

  type RuleCounts {
    white: Int!
    black: Int!
    include: Int!
  }

  type RuleElement {
    id: String!
    name: String!
    ruleType: RuleType!
  }

  enum RuleType {
    Black
    White
    Include
  }

  type Query {
    me: User

    loginUrl: String!

    guilds: [Guild!]!

    rules: [Rule!]!

    rule(id: String!): Rule
  }

  type Mutation {
    login(code: String!): String!

    createRule(name: String!, description: String!): Rule!
  }
`
