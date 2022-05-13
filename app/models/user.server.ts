import type { User } from '@prisma/client'
import { TLRU } from 'tlru'

import { prisma } from '~/db.server'
import { discordApi, getToken } from '~/discordApi.server'

export type { User }

const cache = new TLRU<User['id'], YPUser>({
  maxStoreSize: 1000,
  maxAgeMs: 1000 * 60,
})

export type YPUser = {
  id: string
  tag: string
  avatar: string
}

export async function getUserById(id: User['id']) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return null
  return user
}

export async function convertUser(user: User): Promise<YPUser> {
  let u = cache.get(user.id)
  if (u) {
    return u
  }

  const { data } = await discordApi.get<{
    id: string
    username: string
    discriminator: string
    avatar: string
  }>('/users/@me', {
    headers: { Authorization: await getToken(user) },
  })

  u = {
    id: data.id,
    tag: `${data.username}#${data.discriminator}`,
    avatar: data.avatar
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp`
      : `https://cdn.discordapp.com/embed/avatars/${
          Number(data.discriminator) % 4
        }.webp`,
  }

  cache.set(user.id, u)

  return u
}
