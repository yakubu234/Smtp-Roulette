import { dumpStats, readStats, getRoute } from '../services/requestCounter.js';

export default (req, res, next) => {
    res.on('finish', () => {
        const stats = readStats()
        const event = `${req.method} ${getRoute(req)} ${res.statusCode}`
        stats[event] = stats[event] ? stats[event] + 1 : 1
        dumpStats(stats)
    })
    next()


};
