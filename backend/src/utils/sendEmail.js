const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Strip accidental quotes from environment variables
    const cleanUser = (process.env.SMTP_EMAIL || '').replace(/^["']|["']$/g, '').trim();
    const cleanPass = (process.env.SMTP_PASSWORD || '').replace(/^["']|["']$/g, '').trim();

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: process.env.SMTP_PORT || 2525,
        secure: process.env.SMTP_PORT == 465, // True for 465, false for others
        auth: {
            user: cleanUser,
            pass: cleanPass
        }
    });

    // Define email options
    const cleanFromName = (process.env.FROM_NAME || 'EduSphere Admin').replace(/^["']|["']$/g, '').trim();
    const cleanFromEmail = (process.env.FROM_EMAIL || 'noreply@edusphere.com').replace(/^["']|["']$/g, '').trim();

    const message = {
        from: `"${cleanFromName}" <${cleanFromEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // Mock email for local development testing
    if (process.env.SMTP_EMAIL === 'dummy_user') {
        console.log('--- MOCK EMAIL SENT ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log('-----------------------');
        return;
    }

    // Send the email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
