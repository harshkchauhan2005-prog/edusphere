const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Configure Nodemailer for Brevo SMTP Relay
    // Commercial SMTP relays like Brevo on port 587 bypass Render outbound SMTP blocks
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            // The user login is specific to the Brevo account
            user: 'a46e8b001@smtp-brevo.com',
            pass: process.env.BREVO_API_KEY
        }
    });

    const fromName = (process.env.FROM_NAME || 'EduSphere Admin').replace(/^["']|["']$/g, '').trim();
    // Brevo requires the sender email to be verified in their dashboard
    const fromEmail = (process.env.FROM_EMAIL || 'igxenon638@gmail.com').replace(/^["']|["']$/g, '').trim();

    const message = {
        from: `"${fromName}" <${fromEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Email sent successfully via Brevo SMTP. Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('CRITICAL: Brevo SMTP Email Failed to send to:', options.email);
        console.error('Error Details:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
