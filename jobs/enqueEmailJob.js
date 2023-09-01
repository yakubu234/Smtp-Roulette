import Queue from 'bull';
import dotenv from 'dotenv';

dotenv.config();

// Create a new Bull queue instance
const queue = new Queue('email-queue', {
    redis: {
        host: process.env.REDIS_HOST, // Redis server host
        port: process.env.REDIS_PORT,        // Redis server port
    },
});

// Export the queue instance
export default queue;


