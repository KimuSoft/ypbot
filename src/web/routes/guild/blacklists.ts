import { Router } from 'express'
import db from '../../../utils/db'
import { blacklistCreateSchema } from '../../validation/blacklists'

const router = Router()

router.get('/', async (req, res) => {
    res.json(
        await db.blackList.findMany({
            where: {
                guild: {
                    id: req.guild.discord.id,
                },
            },
        })
    )
})

router.post('/', async (req, res) => {
    const v = await blacklistCreateSchema.safeParseAsync(req.body)
    if (!v.success) {
        res.status(400).json(v.error.issues)
        return
    }

    const { id } = await db.blackList.create({
        data: {
            guildId: req.guild.yp.id,
            name: v.data.name,
        },
    })

    res.json({ id })
})

export default router
