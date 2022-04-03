import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth'
import { userToJson } from '../../utils/userToJson'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v8'
import { discordApi } from '../../api'
import { getToken } from '../../utils/getToken'
import { cts } from '../../../index'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
    const user = req.user!

    const token = await getToken(user)

    const data = await discordApi
        .get<{ id: string; name: string; icon: string; owner: boolean; permissions: string }[]>(Routes.userGuilds(), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.data.filter((x) => parseInt(x.permissions) & 8))

    const result = []

    for (const guild of data) {
        let invited = cts.client.guilds.cache.has(guild.id)
        result.push({
            meta: {
                id: guild.id,
                name: guild.name,
                icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=512` : '',
            },
            invited,
            isOwner: guild.owner,
        })
    }

    res.json({ ...userToJson(user), guilds: result })
})

export default router
