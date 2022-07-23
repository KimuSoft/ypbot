import { getRuleCounts } from "./counts"
import { getRuleElements } from "./elements"

export const ruleResolvers = {
  elements: getRuleElements,
  counts: getRuleCounts,
}
