import io from 'socket.io-client'

import '../config.js'

export const rpc = io(process.env.RPC_URL!, {
  autoConnect: false,
  auth: {
    token: process.env.RPC_SECRET,
  },
})
