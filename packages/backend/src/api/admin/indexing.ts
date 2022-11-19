import { Rule, RuleElement }                       from '@ypbot/database'
import { meilisearch, searchDocumentTransformers } from 'backend/src/utils/meilisearch.js'
import chalk                                       from 'chalk'
import type { FastifyPluginAsync }                 from 'fastify'

export const indexingRoutes: FastifyPluginAsync = async (server) => {
  server.post('/reindex', async (req, reply) => {
    await reply.status(200).send({ message: 'Queued.' })

    const rulesIndex = meilisearch.index('rules')
    const ruleElementsIndex = meilisearch.index('ruleElements')

    console.log(
      `${chalk.blue(`Queued(${chalk.green('delete all documents - rules')})`)}:`,
      await rulesIndex.deleteAllDocuments()
    )
    console.log(
      `${chalk.blue(`Queued(${chalk.green('delete all documents - ruleElements')})`)}:`,
      await ruleElementsIndex.deleteAllDocuments()
    )

    const RulesRepo = req.em.getRepository(Rule)

    const rules = await RulesRepo.findAll()

    await req.em.populate(rules, ['authors'])
    const rulesToAdd = rules.map(searchDocumentTransformers.rule)

    await rulesIndex.addDocumentsInBatches(rulesToAdd, 1024)

    console.log(
      chalk.blue(`Queued ${chalk.green(rulesToAdd.length)} rules to be added to meilisearch.`)
    )

    const RuleElementsRepo = req.em.getRepository(RuleElement)

    const ruleElements = await RuleElementsRepo.findAll()

    const ruleElementsToAdd = ruleElements.map(searchDocumentTransformers.ruleElement)

    await ruleElementsIndex.addDocumentsInBatches(ruleElementsToAdd, 1024)

    console.log(
      chalk.blue(
        `Queued ${chalk.green(rulesToAdd.length)} rule elements to be added to meilisearch.`
      )
    )
  })
}
