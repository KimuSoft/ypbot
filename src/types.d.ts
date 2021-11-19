import { User as DiscordUser } from 'discord.js'
import { User as YPUser } from '@prisma/client'

declare global {
    namespace Express {
        interface User {
            yp: YPUser
            discord: DiscordUser
        }
    }
}
