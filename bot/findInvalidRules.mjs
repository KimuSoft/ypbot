import { config } from 'dotenv'

config({ path: '../.env' })
config({ path: '../shared/.env' })

import { PrismaClient } from '@prisma/client'

const argv = process.argv

const db = new PrismaClient()

const ruleElements = await db.ruleElement.findMany()

for (const el of ruleElements) {
  try {
    await db.$queryRaw`select '' ~* ${el.regex}`
  } catch (e) {
    console.error('----------------------')
    console.error(e.message)
    console.error('element:', el)
    console.error('rule:', await db.rule.findUnique({where: {id: el.ruleId}}))

    if (argv.includes('--delete')) {
      await db.ruleElement.delete({ where: { id: el.id } })
    }
  }
}
