import { Static, Type } from '@sinclair/typebox'
import { Visibility } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { requireAuth } from '../../utils/auth.js'
import { meilisearch, searchDocumentTransformers } from '../../utils/meilisearch.js'

const RuleUpdateSchema = Type.Partial(
  Type.Object({
    name: Type.String({ minLength: 1 }),
    brief: Type.String({ minLength: 1 }),
    description: Type.String(),
    visibility: Type.Enum(Visibility),
  })
)

export const ruleUpdateRoutes: FastifyPluginAsync = async (server) => {
  server.patch<{ Body: Static<typeof RuleUpdateSchema> }>(
    '/:id',
    { schema: { body: RuleUpdateSchema } },
    requireAuth(async (req, reply) => {
      const body = req.body
      const rule = req.context.apiRule

      const authors = rule.authors

      await authors.init()

      if (!authors.toArray().some((x) => x.id === req.user!.id))
        return reply.status(400).send(new Error('Missing permissions'))

      if (body.name) rule.name = body.name
      if (body.brief) rule.brief = body.brief
      if (body.description) rule.description = body.description
      if (body.visibility !== undefined) rule.visibility = body.visibility

      await rule.authors.init()

      await req.em.persistAndFlush(rule)

      await meilisearch
        .index('rules')
        .updateDocuments([searchDocumentTransformers.rule(rule)], { primaryKey: 'id' })

      return rule
    })
  )
}
