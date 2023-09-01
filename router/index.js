import express from 'express';
import { matchedData } from "express-validator";
import fs from 'fs';
import path from 'path';
import queue from '../jobs/enqueEmailJob.js'; // Import the queue handler
import sendEmail from '../requests/sendEmailRequest.js'; // Import the request validator for sendEmail file
const emailLogsDir = path.join('../logs/email');

const router = express.Router();

// Create a new route to send an email
router.post('/send-email', sendEmail, async (req, res) => {
    const requiredData = matchedData(req, { includeOptionals: false });
    // Enqueue email task
    await queue.add('process_email_job', requiredData);
    res.status(200).send('Email queued');
});

// Create a route to fetch and return email log file names
router.get('/error-logs', (req, res) => {
    fs.readdir(emailLogsDir, (err, files) => {
        if (err) {
            console.error('Failed to read email logs directory:', err);
            return res.status(500).send('Internal Server Error');
        }

        const logFileNames = files.filter(file => file.endsWith('.log'));

        res.json(logFileNames);
    });
});

// Create a route to download a specific email log file
router.get('/download-error-log/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(emailLogsDir, filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error('Failed to download email log:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});


// a route to fetch and return the content of an email log by file name
router.get('/error-log/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(emailLogsDir, filename);

    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
            console.error('Failed to read email log:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Assuming the content of the email log is in JSON format
        try {
            const logData = JSON.parse(content);
            const formattedContent = `
                <h1>Email Log</h1>
                <p>Status: ${logData.status}</p>
                <p>Recipient Email: ${logData.recipientEmail}</p>
                <pre>Message: ${logData.message}</pre>
                <p>Timestamp: ${logData.timestamp}</p>
            `;

            res.send(formattedContent);
        } catch (jsonParseError) {
            // Handle JSON parse error (content may not be in JSON format)
            res.send(`<h1>Error Log</h1><pre>${content}</pre>`);
        }
    });
});

export default router;