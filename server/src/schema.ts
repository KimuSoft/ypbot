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

    commonRules: [Rule!]!

    alertChannel: Channel
  }

  type Channel {
    id: String!
    name: String!

    type: Int

    parent: String
    position: Int!

    rules: [Rule!]!
  }

  type Rule {
    id: String!
    name: String!
    description: String!

    elements: [RuleElement!]!

    references: [Rule!]!

    counts: RuleCounts!

    shareCode: String

    sharingEnabled: Boolean!

    author: User!

    isOfficial: Boolean!
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
    separate: Boolean!
    regex: String
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

    guild(id: String!): Guild

    inviteUrl(guild: String!): String!

    rules: [Rule!]!

    sharedRules: [Rule!]!

    officialRules: [Rule!]!

    rule(id: String!): Rule
  }

  input RuleElementCreateInfo {
    name: String!
    ruleType: RuleType!
    regex: String!
    separate: Boolean!
  }

  input RuleElementUpdateInfo {
    name: String
    regex: String
    separate: Boolean
  }

  type RuleElementMutation {
    update(info: RuleElementUpdateInfo!): RuleElement!

    delete: Boolean!
  }

  type RuleMutation {
    updateMeta(name: String, description: String): Rule!

    createElement(info: RuleElementCreateInfo!): RuleElement!

    element(id: String!): RuleElementMutation

    setSharable(value: Boolean!): Boolean!

    setOfficial(value: Boolean!): Boolean!

    addReference(id: String!): Rule

    removeReference(id: String!): Boolean

    delete: Boolean!
  }

  type ChannelMutation {
    addRule(id: String!): Rule
    removeRule(id: String!): Boolean
  }

  type GuildMutation {
    channel(id: String!): ChannelMutation

    resetAlertChannel: Boolean!
    setAlertChannel(id: String!): Boolean!

    addRule(id: String!): Rule
    removeRule(id: String!): Boolean
  }

  type Mutation {
    login(code: String!): String!

    createRule(name: String!, description: String!): Rule!

    rule(id: String!): RuleMutation

    addShared(code: String!): Rule

    removeShared(id: String!): Boolean

    guild(id: String!): GuildMutation

    invite(code: String!): String
  }
`
