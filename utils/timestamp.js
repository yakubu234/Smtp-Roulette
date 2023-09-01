export default function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}


//usage  ->   logWithTimestamp("Script start");