import Promise from 'bluebird'
import chalk from 'chalk'
import { Server } from 'socket.io'

import { identifyCluster } from './cluster/index.js'
import { lookupEvents } from './events/lookup.js'
import './scheduler/index.js'

// @ts-expect-error bluebird
global.Promise = Promise

const io = new Server({ cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log(`${chalk.green('+')} ${chalk.blue(socket.id)}`)

  lookupEvents(socket)

  socket.on('identifyCluster', (id: number) => {
    identifyCluster(socket, id)
  })

  socket.on('disconnect', (reason) => {
    console.log(`${chalk.red('-')} ${chalk.blue(socket.id)} ${chalk.gray(reason)}`)
  })
})

io.listen(9876)

console.log(chalk.blue('Listening on port 9876!'))
