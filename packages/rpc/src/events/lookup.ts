import _ from 'lodash'
import { Socket } from 'socket.io'

import { clusters } from '../cluster/index.js'

export const lookupEvents = (io: Socket) => {
  io.on('lookupGuilds', async (ids: string[], cb) => {
    const guilds = (
      await Promise.all(
        clusters.map(
          (x) =>
            new Promise((resolve) => {
              x.socket.emit('lookupGuilds', ids, (data: unknown) => {
                resolve(data)
              })
              setTimeout(() => {
                resolve(null)
              }, 1000)
            })
        )
      )
    ).filter((x) => !!x)

    cb(_.flatten(guilds))
  }).on('lookupGuild', async (id: string, cb) => {
    const guild = (
      await Promise.all(
        clusters.map(
          (x) =>
            new Promise((resolve) => {
              x.socket.emit('lookupGuild', id, (data: unknown) => {
                resolve(data)
              })
              setTimeout(() => {
                resolve(null)
              }, 1000)
            })
        )
      )
    ).find((x) => !!x)

    cb(guild ?? null)
  })
}
