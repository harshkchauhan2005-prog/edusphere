const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 resolution to prevent Render's ENETUNREACH error with Gmail SMTP over IPv6
dns.setDefaultResultOrder('ipv4first');
const sendEmail = async (options) => {
    // Strip accidental quotes from environment variables
    const cleanUser = (process.env.SMTP_EMAIL || '').replace(/^["']|["']$/g, '').trim();
    const cleanPass = (process.env.SMTP_PASSWORD || '').replace(/^["']|["']$/g, '').trim();

    let host = process.env.SMTP_HOST || 'smtp.mailtrap.io';
    let port = process.env.SMTP_PORT || 2525;
    let secure = process.env.SMTP_PORT == 465; // True for 465, false for others

    // Hardcode overrides for Gmail to bypass Render configuration issues
    let requireTLS = false;
    if (host.includes('gmail.com') || cleanUser.includes('@gmail.com')) {
        host = 'smtp.gmail.com';
        port = 587;
        secure = false;
        requireTLS = true;
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        requireTLS,
        auth: {
            user: cleanUser,
            pass: cleanPass
        },
        tls: {
            rejectUnauthorized: false
        },
        // Force IPv4 to bypass Render's IPv6 routing issues with Gmail
        family: 4
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
