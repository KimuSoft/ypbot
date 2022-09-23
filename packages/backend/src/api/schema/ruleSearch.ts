import { Static, Type } from '@sinclair/typebox'
import { Visibility } from '@ypbot/database'

export const RuleSearchSchema = Type.Object({
  limit: Type.Integer({ maximum: 30, minimum: 1, default: 30 }),
  offset: Type.Integer({ minimum: 0, default: 0 }),
  visibility: Type.Optional(Type.Enum(Visibility)),
  query: Type.String({ default: '' }),
})

export type RuleSearchSchemaType = Static<typeof RuleSearchSchema>
