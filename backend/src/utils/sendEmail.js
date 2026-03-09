const { Resend } = require('resend');

const sendEmail = async (options) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const fromName = (process.env.FROM_NAME || 'EduSphere Admin').replace(/^["']|["']$/g, '').trim();
    // Note: Resend requires a verified domain to send FROM. 
    // Usually 'onboarding@resend.dev' is used for testing if no domain is verified.
    const fromEmail = (process.env.FROM_EMAIL || 'onboarding@resend.dev').replace(/^["']|["']$/g, '').trim();

    try {
        const data = await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        });

        console.log('Email sent successfully via Resend:', data.id);
        return data;
    } catch (error) {
        console.error('CRITICAL: Resend Email Failed to send to:', options.email);
        console.error('Error:', error);
        throw error;
    }
};

module.exports = sendEmail;
