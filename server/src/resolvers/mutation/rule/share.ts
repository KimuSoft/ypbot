import { AuthenticationError } from "apollo-server"
import { prisma, Rule } from "shared"
import { Resolver } from "../../../utils"

export const setRuleSharable: Resolver<
  boolean,
  Rule,
  { value: boolean }
> = async (parent, { value }) => {
  await prisma.rule.update({
    where: { id: parent.id },
    data: {
      sharingEnabled: value,
    },
  })

  return true
}

export const setRuleOfficial: Resolver<
  boolean,
  Rule,
  { value: boolean }
> = async (parent, { value }, ctx) => {
  if (!ctx.user?.admin)
    throw new AuthenticationError(
      "You are not authorized to perform this action"
    )

  await prisma.rule.update({
    where: { id: parent.id },
    data: {
      isOfficial: value,
    },
  })

  return true
}
