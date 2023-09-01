const axios = require('axios');
const axiosRetry = require('axios-retry'); // For retrying failed requests

// Configure Axios with retry logic (up to 3 retries with exponential backoff)
axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
});



// Webhook endpoint to receive instructions from external party

export default async function receiveWebhook(req, res) {
    const instructions = req.body;
    console.log('Received instructions:', instructions);

    try {
        // Process instructions and take appropriate actions (e.g., resend failed emails)

        res.status(200).send('Instructions received successfully');
    } catch (error) {
        console.error('Error processing instructions:', error.message);

        // Send a notification email
        sendNotification(`Error processing instructions: ${error.message}`);

        res.status(500).send('Error processing instructions');
    }
}

// Webhook endpoint to receive instructions from external party
