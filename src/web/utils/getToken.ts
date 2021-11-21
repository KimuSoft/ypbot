import { discordApi } from '../api'
import { config } from '../../config'
import { URLSearchParams } from 'url'
import db from '../../utils/db'

export const getToken = async (user: Express.User) => {
    if (user.yp.discordTokenExpiresAt.getTime() < Date.now()) {
        const params = new URLSearchParams({
            client_id: config.discord.client.id,
            client_secret: config.discord.client.secret,
            grant_type: 'refresh_token',
            refresh_token: user.yp.discordRefreshToken,
            redirect_uri: config.discord.client.callback,
        })

        const { data } = await discordApi.post<{
            access_token: string
            expires_in: number
            refresh_token: string
            scope: string
            token_type: string
        }>('/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        await db.user.update({
            where: {
                id: user.yp.id,
            },
            data: {
                discordRefreshToken: data.refresh_token,
                discordAccessToken: data.access_token,
                discordTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
            },
        })

        return data.access_token
    }

    return user.yp.discordAccessToken
}
