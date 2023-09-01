import retry from 'retry';
import { smtpHost } from '../smtp/activeSMTP.js';
import { sendTransactionalMail } from '../transactionalApi/index.js';
import emailLog from "../logs/EmailLogHandler.js"; // Import the error handler
const type = 'api';

const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 3000,
});


export async function sendMail(emailData) {
    // build the html email here first
    console.log(emailData);
    console.log('you are here')
    return true
    if (emailData.email_type == type) return sendTransactionalMail(emailData);

    try {
        // Create the transporter using the createTransporter function
        const transporter = await smtpHost();

        // Sending email using the same transporter instance
        const emailOptions = {
            from: 'your_email@example.com',
            to: 'recipient@example.com',
            subject: 'Test Email',
            text: 'This is a test email.',
        };

        // Wrap the operation in a Promise for better async/await handling
        await new Promise((resolve, reject) => {
            operation.attempt(async () => {
                try {
                    const info = await transporter.sendMail(emailOptions);
                    console.log('Email sent successfully:', info.response);
                    resolve(info);
                } catch (err) {
                    if (operation.retry(err)) {
                        console.log('Retrying...');
                        return;
                    }
                    console.log('Failed to send email:', err);
                    reject(err);
                }
            });
        });

    } catch (err) {
        console.log('Error sending email:', err);
    }
}
