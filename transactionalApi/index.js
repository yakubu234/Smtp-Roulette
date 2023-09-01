// import smtpHost from '../smtp/activeSMTP.js'; // Use import for consistency

const type = 'smtp';
export async function sendTransactionalMail(emailData) {
    if (emailData.email_type == type) return

    try {
        //perform any transactional mail service here, such as mailgun, snedgrid and lot more.
        console.log('Email sent successfully');
    } catch (err) {
        console.log('Error sending email:', err);
    }
}

