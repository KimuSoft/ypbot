import type { Static }                             from '@sinclair/typebox'
import { Type }                                    from '@sinclair/typebox'
import { Rule }                                    from '@ypbot/database'
import { requireAuth }                             from 'backend/src/utils/auth.js'
import { meilisearch, searchDocumentTransformers } from 'backend/src/utils/meilisearch.js'
import type { FastifyInstance }                    from 'fastify'
import { Visibility }                              from 'ypbot-api-types'

const RuleCreateData = Type.Object({
  name: Type.String({ minLength: 1 }),
  brief: Type.String({ minLength: 1 })
})

export const createRule = (server: FastifyInstance): void => {
  server.post<{
    Body: Static<typeof RuleCreateData>
  }>(
    '/',
    {
      schema: {
        body: RuleCreateData
      }
    },
    requireAuth(async (req) => {
      if (req.user === undefined) throw new Error('user is undefined')

      const rule = new Rule()

      rule.name = req.body.name
      rule.brief = req.body.brief
      rule.description = ''
      rule.visibility = Visibility.Private
      rule.authors.add(req.user)

      await req.em.persistAndFlush(rule)

      await meilisearch.index('rules').addDocuments([searchDocumentTransformers.rule(rule)])

      return rule
    })
  )
}
