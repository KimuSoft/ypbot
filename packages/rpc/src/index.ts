import 'rpc/src/config.js'
import 'rpc/src/scheduler/index.js'
import Promise             from 'bluebird'
import chalk               from 'chalk'
import { identifyCluster } from 'rpc/src/cluster/index.js'
import { lookupEvents }    from 'rpc/src/events/lookup.js'
import { Server }          from 'socket.io'

// @ts-expect-error bluebird
global.Promise = Promise

const io = new Server({ cors: { origin: '*' } })

io.use((socket, next) => {
  if (socket.handshake.auth.token !== process.env.RPC_SECRET) return next(new Error('Unauthorized'))
  next()
})

io.on('connection', (socket) => {
  console.log(`${chalk.green('+')} ${chalk.blue(socket.id)}`)

  lookupEvents(socket)

  socket.on('identifyCluster', (id: number) => {
    identifyCluster(socket, id).catch(err => {
      console.error(chalk.red('Failed to identify cluster:'), err)
    })
  })

  socket.on('disconnect', (reason) => {
    console.log(`${chalk.red('-')} ${chalk.blue(socket.id)} ${chalk.gray(reason)}`)
  })
})

io.listen(9876)

console.log(chalk.blue('Listening on port 9876!'))
