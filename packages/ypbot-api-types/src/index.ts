export interface YPUser {
  id: string
  username: string
  discriminator: string
  avatar: string
  tag: string
  flags: UserFlags
  banner: string | null
  accentColor: number | null
}

export interface YPRuleElement {
  id: number
  name: string
  advanced: boolean
  keyword: string

  type: RuleElementType
}

export interface YPRule {
  id: number

  name: string
  brief: string
  description?: string
  visibility: Visibility
  authors: YPUser[]
}

export enum Visibility {
  Public,
  Private,
}

export enum UserFlags {
  None,
  Admin = 1 << 1,
  Contributor = 1 << 2,
}

export enum RuleElementType {
  White,
  Black
}
