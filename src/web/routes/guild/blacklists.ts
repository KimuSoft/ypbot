import { Router } from 'express'
import db from '../../../utils/db'
import { blacklistCreateSchema, blacklistEditSchema } from '../../validation/blacklists'

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

router.get('/:id', async (req, res) => {
    const blackList = await db.blackList.findFirst({
        where: {
            id: req.params.id,
            guildId: req.guild.discord.id,
        },
    })

    if (!blackList) {
        res.status(404).json({
            message: 'Blacklist not found',
        })
        return
    }

    res.json(blackList)
})

router.put('/:id', async (req, res) => {
    const v = await blacklistEditSchema.safeParseAsync(req.body)
    if (!v.success) {
        res.status(400).json(v.error.issues)
        return
    }

    const blackList = await db.blackList.findFirst({
        where: {
            id: req.params.id,
            guildId: req.guild.discord.id,
        },
    })

    if (!blackList) {
        res.status(404).json({
            message: 'Blacklist not found',
        })
        return
    }

    await db.blackList.update({
        where: {
            id: req.params.id,
        },
        data: {
            name: v.data.name,
            words: v.data.words,
            channels: v.data.channels.filter((x) => req.guild.discord.channels.cache.get(x)),
        },
    })

    res.json({
        message: 'Blacklist updated',
    })
})

router.delete('/:id', async (req, res) => {
    const blackList = await db.blackList.findFirst({
        where: {
            id: req.params.id,
            guildId: req.guild.discord.id,
        },
    })

    if (!blackList) {
        res.status(404).json({
            message: 'Blacklist not found',
        })
        return
    }

    await db.blackList.delete({
        where: {
            id: req.params.id,
        },
    })

    res.json({
        message: 'Blacklist deleted',
    })
})

export default router
