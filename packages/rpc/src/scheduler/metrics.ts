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

scheduleJob('*/30 * * * * *', () => {
  const metrics = clusters.map(
    (x) =>
      new Promise((resolve, reject) => {
        x.socket.emit('metrics', (data: MetricData) => {
          console.log(data)
        })
      })
  )
})
