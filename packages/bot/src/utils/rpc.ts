import 'bot/src/config.js'
import io from 'socket.io-client'

if (process.env.RPC_URL === undefined) throw new Error('RPC_URL is undefined')

export const rpc = io(process.env.RPC_URL, {
  autoConnect: false,
  auth: {
    token: process.env.RPC_SECRET
  }
})
