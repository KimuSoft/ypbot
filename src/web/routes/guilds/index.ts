import { Router } from 'express'
import { cts } from '../../../index'
import { Guild } from 'discord.js'

const router = Router({ mergeParams: true })

declare global {
    namespace Express {
        interface Request {
            guild: Guild
        }
    }
}

router.use(async (req, res, next) => {
    const id = req.params.id
    const guild = await cts.client.guilds.cache.get(id)
    if (!guild) {
        return res.status(404).json({ error: 'guild not found' })
    }
    req.guild = guild
    next()
})

router.get('/', (req, res) => {
    const guild = req.guild
    res.json({
        meta: {
            name: guild.name,
            id: guild.id,
            icon: guild.iconURL(),
        },
        channels: guild.channels.cache
            .filter((x) => ((x.type === 'GUILD_TEXT' || x.type === 'GUILD_NEWS') && guild.me?.permissionsIn(x).has('MANAGE_MESSAGES')) || false)
            .map((x) => ({
                id: x.id,
                name: x.name,
                type: x.type,
                category: x.parent,
            })),
    })
})

export default router
