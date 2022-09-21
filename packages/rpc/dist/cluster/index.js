import { Collection } from '@discordjs/collection';
import chalk from 'chalk';
import { Cluster } from './structures/Cluster.js';
export const clusters = new Collection();
export const identifyCluster = (socket, id) => {
    if (clusters.has(id))
        return socket.disconnect(true);
    const cluster = new Cluster(id, socket);
    clusters.set(id, cluster);
    socket.on('disconnect', () => {
        clusters.delete(id);
    });
    console.log(`${chalk.yellow('i')} ${chalk.blue(socket.id)} => Cluster ${chalk.blue(id)}`);
};
