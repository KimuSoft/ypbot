import { Collection } from '@discordjs/collection'
import chalk from 'chalk'
import { Socket } from 'socket.io'

import { collectMetrics } from '../scheduler/metrics.js'
import { Cluster } from './structures/Cluster.js'

export const clusters = new Collection<number, Cluster>()

export const identifyCluster = async (socket: Socket, id: number) => {
  if (clusters.has(id)) return socket.disconnect(true)

  const cluster = new Cluster(id, socket)

  clusters.set(id, cluster)

  socket.on('disconnect', () => {
    clusters.delete(id)
  })

  console.log(`${chalk.yellow('i')} ${chalk.blue(socket.id)} => Cluster ${chalk.blue(id)}`)

  await collectMetrics()
}
