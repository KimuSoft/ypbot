import { prisma, Rule } from "shared"
import { Resolver } from "../../../utils"

type Params = {
  name: string
  description: string
}

export const updateRuleMeta: Resolver<Rule, Rule, Partial<Params>> = async (
  parent,
  params
) => {
  return prisma.rule.update({
    where: {
      id: parent.id,
    },
    data: {
      name: params.name || undefined,
      description: params.description || undefined,
    },
  })
}
