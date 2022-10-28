import { scheduleJob } from 'node-schedule'
import { clusters }    from 'rpc/src/cluster/index.js'

type ShardStatus =
  | 'connecting'
  | 'disconnected'
  | 'handshaking'
  | 'identifying'
  | 'ready'
  | 'resuming'

interface MetricShard {
  id: number
  status: ShardStatus
  ping: number | null
}

interface MetricData {
  id: number
  shards: MetricShard[]
  guilds: number
  memoryUsage: NodeJS.MemoryUsage
}

export const collectMetrics = async (): Promise<MetricData[]> => {
  const metrics = (
    await Promise.all(
      clusters.map(
        async (x) =>
          await new Promise<MetricData | null>((resolve) => {
            x.socket.emit('metrics', (data: MetricData) => {
              resolve(data)
            })
            setTimeout(() => {
              resolve(null)
            }, 1000)
          })
      )
    )
  ).filter((x) => x !== null) as MetricData[]

  return metrics
}

scheduleJob('*/30 * * * * *', async () => {
  const metrics = await collectMetrics()

  console.log('Metrics collected', metrics)

  // TODO push metrics
})
