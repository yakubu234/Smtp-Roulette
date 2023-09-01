import queue from './enqueEmailJob.js'; // Import the Bull queue instance
import { sendMail } from '../smtp/sendMail.js' // Import the email sender function
import logWithTimestamp from '../utils/timestamp.js'; // Import the execution timestamp logger
import emailLog from "../logs/EmailLogHandler.js"; // Import the error handler

let emailData;


// Process the email sending job
queue.process('process_email_job', async (job) => {
    logWithTimestamp('the job begin processing');
    emailData = job.data;
    try {
        const info = await sendMail(emailData);
        // emailLog(emailData.recepient_email, info.response, 'success');
        //send a web hook
    } catch (error) {
        emailLog(emailData.recepient_email, error, 'error');
        logWithTimestamp('the job get error while  processing');
        //store the data object in redis with the email and subject hashed//
        // send a web hook
        throw error;
    }
});

queue.on('completed', (job) => {
    logWithTimestamp('the job completed processing');
    emailLog(emailData.recepient_email, `Job completed: ${JSON.stringify(job.data.email_subject)}`, 'success');
});

queue.on('failed', (job, err) => {
    emailLog(emailData.recepient_email, `Job failed: ${JSON.stringify(job.data.email_subject)}, Error: ${JSON.stringify(err)}`, 'error');
    console.error(`Job failed: ${job.data}`, err);
});