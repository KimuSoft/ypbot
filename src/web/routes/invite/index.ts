import { Router } from 'express'
import { config } from '../../../config'
import { URLSearchParams } from 'url'
import { discordApi } from '../../api'

const router = Router()

router.get('/callback', async (req, res) => {
    if (!req.query.code || !req.query.guild_id || !req.query.permissions) return res.redirect('/')

    try {
        const { data } = await discordApi.post(
            '/oauth2/token',
            new URLSearchParams({
                client_id: config.discord.client.id,
                client_secret: config.discord.client.secret,
                scope: 'identify bot',
                grant_type: 'authorization_code',
                permissions: '8',
                code: req.query.code as string,
                redirect_uri: config.discord.client.inviteCallback,
                guild_id: req.query.guild_id as string,
            })
        )

        res.redirect(`/servers/${data.guild.id}`)
    } catch (e: any) {
        res.json(e.response.data)
    }
})

router.get('/:id', (req, res) => {
    const params = new URLSearchParams({
        client_id: config.discord.client.id,
        scope: 'identify bot',
        permissions: '8',
        guild_id: req.params.id,
        disable_guild_select: 'true',
        redirect_uri: config.discord.client.inviteCallback,
        response_type: 'code',
    })
    res.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
})

export default router
