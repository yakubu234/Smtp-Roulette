import express from 'express';
import { matchedData } from "express-validator";
// import jsonParser from ('body-parser').json();
import fs from 'fs';
import path from 'path';
import queue from '../jobs/enqueEmailJob.js'; // Import the queue handler
import sendEmail from '../requests/sendEmailRequest.js'; // Import the request validator for sendEmail file
let emailLogsDir = path.resolve('./');
emailLogsDir += "/logs/email"

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

    console.log(filePath);

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

            const logs = [];
            for (const log of logData) {
                logs.push({
                    status: log.status,
                    recipientEmail: log.recipientEmail + `i am here`,
                    message: log.message,
                    timestamp: log.timestamp,
                });

            }

            res.json(logs);
        } catch (error) {
            console.log(error)
            res.json(error);
        }
    });
});

export default router;