import type { Static }                             from '@sinclair/typebox'
import { Type }                                    from '@sinclair/typebox'
import { requireAuth }                             from 'backend/src/utils/auth.js'
import { meilisearch, searchDocumentTransformers } from 'backend/src/utils/meilisearch.js'
import type { FastifyPluginAsync }                 from 'fastify'
import { RuleElementType }                         from 'ypbot-api-types'

const RuleElementUpdateSchema = Type.Partial(
  Type.Object({
    name: Type.String({ minLength: 1 }),
    keyword: Type.String({ minLength: 1 }),
    advanced: Type.Boolean(),
    type: Type.Enum(RuleElementType)
  })
)

export const updateRuleElementRoutes: FastifyPluginAsync = async (server) => {
  server.patch<{ Body: Static<typeof RuleElementUpdateSchema> }>(
    '/:elId',
    { schema: { body: RuleElementUpdateSchema } },
    requireAuth(async (req, reply) => {
      const rule = req.context.apiRule

      const authors = rule.authors

      await authors.init()

      if (!authors.toArray().some((x) => x.id === req.user?.id)) return await reply.status(400).send(new Error('Missing permissions'))

      const body = req.body

      const el = req.context.apiRuleElement

      if (body.name !== undefined && body.name.length !== 0) el.name = body.name
      if (body.keyword !== undefined && body.keyword.length !== 0) el.keyword = body.keyword
      if (body.advanced !== undefined) el.advanced = body.advanced
      if (body.type !== undefined) el.type = body.type

      await req.em.persistAndFlush(el)

      await meilisearch
        .index('ruleElements')
        .updateDocuments([searchDocumentTransformers.ruleElement(el)], { primaryKey: 'id' })

      return el
    })
  )
}
