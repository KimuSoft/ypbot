import { Router } from 'express'
import { cts } from '../../../index'
import { getYPGuild } from '../../../utils/guild'
import { Guild } from 'discord.js'
import { Guild as YPGuild } from '@prisma/client'

const router = Router({
    mergeParams: true,
})

declare global {
    namespace Express {
        interface Request {
            guild: {
                discord: Guild
                yp: YPGuild
            }
        }
    }
}

router.use(async (req, res, next) => {
    try {
        const guild = cts.client.guilds.cache.get(req.params.id) || (await cts.client.guilds.fetch(req.params.id))
        if (!guild) return res.status(404).json({ error: 'Guild not found.' })
        const ypGuild = await getYPGuild(guild)
        req.guild = {
            yp: ypGuild,
            discord: guild,
        }
        next()
    } catch (e) {
        res.status(404).json({ error: 'Guild not found.' })
    }
})

router.get('/', (req, res) => {
    const d = req.guild.discord

    res.json({
        id: d.id,
        name: d.name,
        icon: d.iconURL({ size: 512, dynamic: true }),
    })
})

export default router