import { Static, Type } from '@sinclair/typebox'
import { RuleElement } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { requireAuth } from '../../../utils/auth.js'
import { meilisearch, searchDocumentTransformers } from '../../../utils/meilisearch.js'

const CreateElementSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  keyword: Type.String({ minLength: 1 }),
  advanced: Type.Boolean(),
})

export const createRuleElement: FastifyPluginAsync = async (server) => {
  server.post<{
    Body: Static<typeof CreateElementSchema>
  }>(
    '/',
    { schema: { body: CreateElementSchema } },
    requireAuth(async (req, reply) => {
      const { name, keyword, advanced } = req.body
      const rule = req.context.apiRule

      const authors = await rule.authors.init()

      if (!authors.toArray().some((x) => x.id === req.user!.id))
        return reply.status(400).send(new Error('Missing permissions'))

      const elem = new RuleElement()

      elem.name = name
      elem.keyword = keyword
      elem.advanced = advanced
      elem.rule = rule

      await req.em.persistAndFlush(elem)

      await meilisearch
        .index('ruleElements')
        .addDocuments([searchDocumentTransformers.ruleElement(elem)])

      return elem
    })
  )
}