import { getAuthor } from "./author"
import { getRuleCounts } from "./counts"
import { getRuleElements } from "./elements"
import { getRuleReferences } from "./reference"

export const ruleResolvers = {
  elements: getRuleElements,
  counts: getRuleCounts,
  author: getAuthor,
  references: getRuleReferences,
}
