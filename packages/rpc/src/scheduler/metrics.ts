import { scheduleJob } from 'node-schedule'

import { clusters } from '../cluster/index.js'

type ShardStatus =
  | 'connecting'
  | 'disconnected'
  | 'handshaking'
  | 'identifying'
  | 'ready'
  | 'resuming'

type MetricShard = {
  id: number
  status: ShardStatus
  ping: number | null
}

type MetricData = {
  id: number
  shards: MetricShard[]
  guilds: number
  memoryUsage: NodeJS.MemoryUsage
}

let currentStats: MetricData[] = []

export const collectMetrics = async () => {
  const metrics = (
    await Promise.all(
      clusters.map(
        (x) =>
          new Promise<MetricData | null>((resolve) => {
            x.socket.emit('metrics', (data: MetricData) => {
              resolve(data)
            })
            setTimeout(() => {
              resolve(null)
            }, 1000)
          })
      )
    )
  ).filter((x) => !!x) as MetricData[]

  currentStats = metrics

  return metrics
}

scheduleJob('*/30 * * * * *', async () => {
  const metrics = await collectMetrics()

  // TODO push metrics
})
