import { rpc }   from 'bot/src/utils/rpc.js'
import type Eris from 'eris'

if (process.env.CLUSTER_ID === undefined) throw new Error('CLUSTER_ID is undefined')

const clusterId = +process.env.CLUSTER_ID

export const initMetrics = (client: Eris.Client): void => {
  rpc.on('metrics', (respond) => {
    const shards = client.shards.map((x) => ({
      status: x.status,
      ping: x.latency,
      id: x.id
    }))

    respond({
      id: clusterId,
      shards,
      guilds: client.guilds.size,
      memoryUsage: process.memoryUsage()
    })
  })
}
