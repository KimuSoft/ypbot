import { prisma, Rule, YPUser } from "shared"
import { fetchUser, Resolver } from "../../../utils"

export const getAuthor: Resolver<YPUser, Rule> = (parent) => {
  return prisma.user
    .findUnique({ where: { id: parent.authorId } })
    .then((x) => fetchUser(x!))
}
