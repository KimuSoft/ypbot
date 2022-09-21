import { rpc } from './rpc.js';
export const initMetrics = (client) => {
    rpc.on('metrics', (respond) => {
        const shards = client.shards.map((x) => ({
            status: x.status,
            ping: x.latency,
            id: x.id,
        }));
        respond({
            id: +process.env.CLUSTER_ID,
            shards,
            guilds: client.guilds.size,
        });
    });
};
