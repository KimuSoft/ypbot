import { Static, Type } from '@sinclair/typebox'
import { FastifyPluginAsync } from 'fastify'

import { meilisearch, searchDocumentTransformers } from '../../../utils/meilisearch.js'

const RuleElementUpdateSchema = Type.Partial(
  Type.Object({
    name: Type.String({ minLength: 1 }),
    keyword: Type.String({ minLength: 1 }),
    advanced: Type.Boolean(),
  })
)

export const updateRuleElementRoutes: FastifyPluginAsync = async (server) => {
  server.patch<{ Body: Static<typeof RuleElementUpdateSchema> }>(
    '/:elId',
    { schema: { body: RuleElementUpdateSchema } },
    async (req) => {
      const body = req.body

      const el = req.context.apiRuleElement

      if (body.name) el.name = body.name
      if (body.keyword) el.keyword = body.keyword
      if (body.advanced !== undefined) el.advanced = body.advanced

      await req.em.persistAndFlush(el)

      await meilisearch
        .index('ruleElements')
        .updateDocuments([searchDocumentTransformers.ruleElement(el)], { primaryKey: 'id' })

      return el
    }
  )
}
