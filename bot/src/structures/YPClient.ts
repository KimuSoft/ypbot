import { CommandClient } from "@pikokr/command.ts"
import * as Cluster from "discord-hybrid-sharding"

export class YPClient extends CommandClient {
  cluster = new Cluster.Client(this.discord)
}
