import { Static, Type } from '@sinclair/typebox'
import { RuleElement } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { meilisearch, searchDocumentTransformers } from '../../../utils/meilisearch.js'

const CreateElementSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  keyword: Type.String({ minLength: 1 }),
  advanced: Type.Boolean(),
})

export const createRuleElement: FastifyPluginAsync = async (server) => {
  server.post<{
    Body: Static<typeof CreateElementSchema>
  }>('/', { schema: { body: CreateElementSchema } }, async (req) => {
    const { name, keyword, advanced } = req.body
    const rule = req.context.apiRule

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
}
