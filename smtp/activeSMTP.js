import nodemailer from 'nodemailer';
import fs from 'fs/promises';// For reading the JSON file asynchronously

export async function smtpHost() {
    try {
        const smtpHosts = await fs.readFile('../json/smtp-hosts.json', 'utf-8');
        const smtpHostList = JSON.parse(smtpHosts);

        for (const smtpHost of smtpHostList) {
            const transporter = nodemailer.createTransport({
                host: smtpHost.host,
                port: smtpHost.port,
                secure: smtpHost.secure,
                auth: {
                    user: smtpHost.username, // Replace with a valid email address
                    pass: smtpHost.password,    // Replace with the email password
                },
            });

            try {
                transporter.connect();
                await transporter.verify();
                console.log(`SMTP host ${smtpHost.host} is reachable and can send emails`);
                return transporter; // Return the transporter instance
            } catch (err) {
                console.log(`SMTP host ${smtpHost.host} is down or cannot send emails`);
            }
        }

        // If none of the hosts are available, throw an error
        throw new Error('No working SMTP hosts available');
    } catch (error) {
        console.error('Error reading SMTP hosts:', error);
    }
}
