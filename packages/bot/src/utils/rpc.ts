import io from 'socket.io-client'

export const rpc = io(process.env.RPC_URL!, { autoConnect: false })
