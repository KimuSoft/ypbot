import { Collection }     from '@discordjs/collection'
import chalk              from 'chalk'
import { Cluster }        from 'rpc/src/cluster/structures/Cluster.js'
import { collectMetrics } from 'rpc/src/scheduler/metrics.js'
import type { Socket }    from 'socket.io'

export const clusters = new Collection<number, Cluster>()

export const identifyCluster = async (socket: Socket, id: number): Promise<void> => {
  if (clusters.has(id)) {
    socket.disconnect(true)
    return
  }

  const cluster = new Cluster(id, socket)

  clusters.set(id, cluster)

  socket.on('disconnect', () => {
    clusters.delete(id)
  })

  console.log(`${chalk.yellow('i')} ${chalk.blue(socket.id)} => Cluster ${chalk.blue(id)}`)

  await collectMetrics()
}
