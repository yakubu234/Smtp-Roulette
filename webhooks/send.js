const axios = require('axios');
const axiosRetry = require('axios-retry'); // For retrying failed requests

// Configure Axios with retry logic (up to 3 retries with exponential backoff)
axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
});


// Webhook endpoint to send information after email completion
export default async function sendWebhook(req, res) {
    const payload = req.body;
    const externalApiKey = 'EXTERNAL_API_KEY';
    const externalApiUrl = 'EXTERNAL_API_URL';

    try {
        const response = await axios.post(externalApiUrl, payload, {
            headers: {
                'Authorization': `Bearer ${externalApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Sent data to external party:', response.data);
        res.status(200).send('Webhook sent successfully');
    } catch (error) {
        console.error('Error sending data:', error.message);

        // Retry logic is already handled by axiosRetry

        // Send a notification email
        sendNotification(`Error sending data to external party: ${error.message}`);

        res.status(500).send('Error sending webhook');
    }
}
