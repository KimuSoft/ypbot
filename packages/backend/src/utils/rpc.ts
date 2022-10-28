import 'backend/src/config.js'
import io from 'socket.io-client'

if (process.env.RPC_URL === undefined) throw new Error('RPC_URL is not defined')

export const rpc = io(process.env.RPC_URL, {
  autoConnect: false,
  auth: {
    token: process.env.RPC_SECRET
  }
})

export const rpcFetch = async <T = unknown>(...args: unknown[]): Promise<T> => {
  return await new Promise<T>((resolve, reject) => {
    args = [
      ...args,
      (data: T) => {
        resolve(data)
      }
    ]
    // @ts-expect-error
    rpc.emit(...args)

    setTimeout(() => reject(new Error('RPC timed out')), 2000)
  })
}
