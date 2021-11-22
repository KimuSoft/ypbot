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
    const data = await blacklistCreateSchema.safeParseAsync(req.body)
    if (!data.success) {
        res.status(400).json(data.error.issues)
        return
    }
})

export default router
