import { Static, Type } from '@sinclair/typebox'
import { Rule, Visibility } from '@ypbot/database'
import { FastifyInstance } from 'fastify'

import { requireAuth } from '../../utils/auth.js'

const RuleCreateData = Type.Object({
  name: Type.String({ minLength: 1 }),
  brief: Type.String({ minLength: 6 }),
})

export const createRule = (server: FastifyInstance) => {
  server.post<{
    Body: Static<typeof RuleCreateData>
  }>(
    '/',
    {
      schema: {
        body: RuleCreateData,
      },
    },
    requireAuth(async (req) => {
      const rule = new Rule()

      rule.name = req.body.name
      rule.brief = req.body.brief
      rule.description = ''
      rule.visibility = Visibility.Private
      rule.authors.add(req.user!)

      await req.em.persistAndFlush(rule)

      return rule
    })
  )
}
