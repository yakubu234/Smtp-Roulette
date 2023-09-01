const express = require('express');
const nodemailer = require('nodemailer');
const queue = require('queue');
const retry = require('retry');

const app = express();

// Read the list of SMTP hosts from a .json file
const smtpHosts = require('./smtp-hosts.json');

// Create a new queue instance
const queueInstance = queue({
    timeout: 30000,
    concurrency: 1,
});

// Create a function to send an email with retry logic
function sendEmailWithRetry(emailData, smtpHost, callback) {
    const operation = retry.operation({
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 3000,
    });

    operation.attempt(() => {
        const message = {
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
        };

        transporter.sendMail(
            {
                host: smtpHost.host,
                port: smtpHost.port,
                secure: smtpHost.secure,
                auth: {
                    user: smtpHost.username,
                    pass: smtpHost.password,
                },
            },
            message,
            (err, info) => {
                if (operation.retry(err)) {
                    console.log('Retrying...');
                    return;
                }

                if (err) {
                    callback(err);
                } else {
                    callback(null, info);
                }
            }
        );
    });
}

// Create a new route to send an email
app.post('/send-email', (req, res) => {
    // Get the email data from the request body
    const emailData = req.body;

    // Randomly choose an SMTP host from the list
    const smtpHost = smtpHosts[Math.floor(Math.random() * smtpHosts.length)];

    // Add the email sending task to the queue
    queueInstance.push((cb) => {
        sendEmailWithRetry(emailData, smtpHost, (err, info) => {
            if (err) {
                console.error('Failed to send email:', err);
            } else {
                console.log('Email sent:', info.response);
            }
            cb();
        });
    });

    res.status(200).send('Email queued');
});

// Start the queue
queueInstance.start();

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
