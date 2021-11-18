import { enhancePrisma } from 'blitz'
import { PrismaClient } from '@prisma/client'

const EnhancedPrisma = enhancePrisma(PrismaClient)

const client = new EnhancedPrisma()

export default client
