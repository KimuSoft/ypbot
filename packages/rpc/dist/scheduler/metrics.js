import { scheduleJob } from 'node-schedule';
import { clusters } from '../cluster/index.js';
scheduleJob('*/30 * * * * *', () => {
    const metrics = clusters.map((x) => new Promise((resolve, reject) => {
        x.socket.emit('metrics', (data) => {
            console.log(data);
        });
    }));
});
