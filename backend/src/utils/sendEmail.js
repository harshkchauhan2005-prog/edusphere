const sendEmail = async (options) => {
    const apiKey = process.env.BREVO_API_KEY;

    const fromName = (process.env.FROM_NAME || 'EduSphere Admin').replace(/^["']|["']$/g, '').trim();
    const fromEmail = (process.env.FROM_EMAIL || 'igxenon638@gmail.com').replace(/^["']|["']$/g, '').trim();

    const url = 'https://api.brevo.com/v3/smtp/email';

    const data = {
        sender: { name: fromName, email: fromEmail },
        to: [{ email: options.email }],
        subject: options.subject,
        textContent: options.message,
        htmlContent: options.html
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send email via Brevo API');
        }

        console.log('Email sent successfully via Brevo HTTP API. Message ID:', result.messageId);
        return result;
    } catch (error) {
        console.error('CRITICAL: Brevo API Email Failed to send to:', options.email);
        console.error('Error Details:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
