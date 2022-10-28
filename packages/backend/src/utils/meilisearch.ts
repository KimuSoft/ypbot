import 'backend/src/config.js'
import type { Rule, RuleElement } from '@ypbot/database'
import { MeiliSearch }            from 'meilisearch'

if (process.env.MEILISEARCH_URL === undefined) throw new Error('MEILISEARCH_URL is undefined')

export const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_TOKEN
})

export const searchDocumentTransformers = {
  rule: (rule: Rule) => ({
    id: rule.id,
    name: rule.name,
    brief: rule.brief,
    description: rule.description,
    visibility: rule.visibility,
    authors: rule.authors.toArray().map((x) => x.id)
  }),
  ruleElement: (elem: RuleElement) => ({
    id: elem.id,
    name: elem.name,
    keyword: elem.keyword,
    advanced: elem.advanced,
    rule: elem.rule.id
  })
}
