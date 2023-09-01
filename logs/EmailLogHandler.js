import fs from 'fs';
import path from 'path';
import moment from 'moment';

// Function to log errors to a text file
export default function emailLog(email, message, status = 'error') {
    const timestamp = moment().format('YYYY-MM-DD HH-mm-ss');
    const filename = `${moment().format('YYYY-MM-DD')}_email_handler.log`;
    const filePath = path.join('../logs/email', filename);

    const logContent = {
        recipientEmail: email,
        timestamp: timestamp,
        status: status,
        message: message.stack || message,
    };// the content you want to log

    fs.access(filePath, fs.constants.F_OK, async (accessErr) => {
        if (accessErr) {
            // Log file does not exist

            const initialLogData = [];
            initialLogData.push(logContent);
            return await writeLogDataToFile(filePath, initialLogData);
        }
        // File exists, read and update log data
        return await readLogDataAndUpdate(filePath, logContent);

    });

}

async function readLogDataAndUpdate(logFilePath, newData) {

    try {
        const existingData = await fs.readFile(logFilePath, 'utf8');
    } catch (readErr) {
        console.error(`Error reading log file: ${readErr}`);
        return;
    }

    let logArray = [];

    if (existingData) {
        try {
            logArray = JSON.parse(existingData);
            if (!Array.isArray(logArray)) {
                console.error('Invalid log data format. Appending new data anyway.');
                logArray = [];
            }
        } catch (parseError) {
            console.error(`Error parsing existing log data: ${parseError}`);
        }
    }

    logArray.push(newData);

    // Write updated log data
    await writeLogDataToFile(logFilePath, logArray);
}

function writeLogDataToFile(logFilePath, newData) {
    fs.writeFile(logFilePath, JSON.stringify(newData, null, 2), (writeErr) => {
        if (writeErr) {
            console.error(`Error writing to log file: ${writeErr}`);
        } else {
            console.log('Error logged to:', logFilePath);
        }
    });
}