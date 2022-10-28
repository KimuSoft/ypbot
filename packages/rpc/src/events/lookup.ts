import _               from 'lodash'
import { clusters }    from 'rpc/src/cluster/index.js'
import type { Socket } from 'socket.io'

export const lookupEvents = (io: Socket): void => {
  io.on('lookupGuilds', async (ids: string[], cb) => {
    const guilds = (
      await Promise.all(
        clusters.map(
          async (x) =>
            await new Promise((resolve) => {
              x.socket.emit('lookupGuilds', ids, (data: unknown) => {
                resolve(data)
              })
              setTimeout(() => {
                resolve(null)
              }, 1000)
            })
        )
      )
    ).filter((x) => x !== null)

    cb(_.flatten(guilds))
  })
    .on('lookupGuild', async (id: string, cb) => {
      const guild = (
        await Promise.all(
          clusters.map(
            async (x) =>
              await new Promise((resolve) => {
                x.socket.emit('lookupGuild', id, (data: unknown) => {
                  resolve(data)
                })
                setTimeout(() => {
                  resolve(null)
                }, 1000)
              })
          )
        )
      ).find((x) => x !== null)

      cb(guild ?? null)
    })
    .on('lookupGuildChannels', async (id: string, cb) => {
      const guild = (
        await Promise.all(
          clusters.map(
            async (x) =>
              await new Promise((resolve) => {
                x.socket.emit('lookupGuildChannels', id, (data: unknown) => {
                  resolve(data)
                })
                setTimeout(() => {
                  resolve(null)
                }, 1000)
              })
          )
        )
      ).find((x) => x !== null)

      cb(guild ?? null)
    })
    .on('lookupGuildChannel', async (guildId: string, channelId: string, cb) => {
      const guild = (
        await Promise.all(
          clusters.map(
            async (x) =>
              await new Promise((resolve) => {
                x.socket.emit('lookupGuildChannel', guildId, channelId, (data: unknown) => {
                  resolve(data)
                })
                setTimeout(() => {
                  resolve(null)
                }, 1000)
              })
          )
        )
      ).find((x) => x !== null)

      cb(guild ?? null)
    })
}
