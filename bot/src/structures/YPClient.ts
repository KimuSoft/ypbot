import { CommandClient } from "@pikokr/command.ts"
import * as Cluster from "discord-hybrid-sharding"
import Dokdo from "dokdo"

export class YPClient extends CommandClient {
  cluster = new Cluster.Client(this.discord)

  dokdo = new Dokdo(this.discord, {
    noPerm: () => {},
    owners: [],
    prefix: "..",
    isOwner: (user) => this.owners.has(user.id),
  })
}
