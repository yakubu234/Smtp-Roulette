import fs from 'fs';
import path from 'path';
import moment from 'moment';

// Function to log errors to a text file
export default function emailLog(email, message, status = 'error') {
    const timestamp = moment().format('YYYY-MM-DD HH-mm-ss');
    const filename = `${moment().format('YYYY-MM-DD')}_email_handler.log`;
    const filePath = path.join('../logs/email', filename);

    const logContent = JSON.stringify({
        recipientEmail: email,
        timestamp: timestamp,
        status: status,
        message: message.stack || message,
    }, null, 2);

    fs.appendFile(filePath, `\n${logContent}\n`, (err) => {
        if (err) {
            console.error('Failed to write error log:', err);
        } else {
            console.log('Error logged to:', filePath);
        }
    });
}