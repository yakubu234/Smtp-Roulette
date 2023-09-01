import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection object with the separated fields.
mongoose = mongoose.createConnection({
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    password: process.env.MONGODB_PASSWORD,
    database: process.env.MONGODB_DATABASE,
    user: process.env.MONGODB_USER,
    authSource: process.env.MONGODB_AUTH_SOURCE,
});

// Create a table if it does not exist.
const table = mongoose.model('bee_queue');
if (!table.mongoose.exists()) {
    table.createCollection();
}

// Close the connection if no activity.
mongoose.on('idleTimeout', () => {
    mongoose.close();
});

// Export the connection instance.
module.exports = mongoose;