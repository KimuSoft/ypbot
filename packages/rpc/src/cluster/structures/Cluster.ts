import { Socket } from 'socket.io'

export class Cluster {
  constructor(public id: number, public socket: Socket) {}
}
