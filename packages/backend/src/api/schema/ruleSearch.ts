import type { Static } from '@sinclair/typebox'
import { Type }        from '@sinclair/typebox'
import { Visibility }  from 'ypbot-api-types'

export const RuleSearchSchema = Type.Object({
  limit: Type.Integer({ maximum: 30, minimum: 1, default: 30 }),
  offset: Type.Integer({ minimum: 0, default: 0 }),
  visibility: Type.Optional(Type.Enum(Visibility)),
  query: Type.String({ default: '' })
})

export const ChanenlRuleSearchSchema = Type.Object({
  limit: Type.Integer({ maximum: 30, minimum: 1, default: 30 }),
  offset: Type.Integer({ minimum: 0, default: 0 })
})

export type RuleSearchSchemaType = Static<typeof RuleSearchSchema>

export const RuleElementSearchSchema = Type.Object({
  limit: Type.Integer({ maximum: 30, minimum: 1, default: 30 }),
  offset: Type.Integer({ minimum: 0, default: 0 }),
  query: Type.String({ default: '' })
})

export type RuleElementSearchSchemaType = Static<typeof RuleElementSearchSchema>
