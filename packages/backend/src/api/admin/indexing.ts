import { Rule, RuleElement } from '@ypbot/database'
import chalk from 'chalk'
import { FastifyPluginAsync } from 'fastify'

import { meilisearch, searchDocumentTransformers } from '../../utils/meilisearch.js'

export const indexingRoutes: FastifyPluginAsync = async (server) => {
  server.post('/reindex', async (req, reply) => {
    reply.status(200).send({ message: 'Queued.' })

    const rulesIndex = meilisearch.index('rules')
    const ruleElementsIndex = meilisearch.index('ruleElements')

    await rulesIndex.updateSettings({
      searchableAttributes: ['id', 'name', 'brief', 'description'],
      filterableAttributes: ['authors', 'visibility'],
    })
    await ruleElementsIndex.updateSettings({
      searchableAttributes: ['name', 'keyword'],
      filterableAttributes: ['rule'],
    })

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
