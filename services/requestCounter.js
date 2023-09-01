import path from 'path';
import fs from 'fs'

let emailLogsDir = path.resolve('./');

emailLogsDir += "/logs/request_stats";
const FILE_PATH = path.join(emailLogsDir, 'stats.json');

export function getRoute(req) {
    const route = req.route ? req.route.path : '' // check if the handler exist
    const baseUrl = req.baseUrl ? req.baseUrl : '' // adding the base url if the handler is child of other handler

    return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route'
}


// read json object from file
export function readStats() {
    let result = {}
    try {
        result = JSON.parse(fs.readFileSync(FILE_PATH))
    } catch (err) {
        console.error(err)
    }
    return result
}

// dump json object to file
export function dumpStats(stats) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(stats), { flag: 'w+' })
    } catch (err) {
        console.error(err)
    }
}
