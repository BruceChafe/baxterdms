import express from 'express';
import fetch from 'node-fetch'; // Ensure you've installed node-fetch if it's not already
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint to send emails using MailerSend
app.post('/send-email', async (req, res) => {
    console.log("Received request to send email");
    const { to, from, subject, body, text } = req.body;

    // MailerSend API endpoint
    const apiUrl = 'https://api.mailersend.com/v1/email';
    const apiKey = process.env.MAILERSEND_API_KEY; // Store your API key in an environment variable for security

    try {
        const payload = {
            from: {
                email: from // Sender email
            },
            to: [{
                email: to // Recipient email
            }],
            subject: subject,
            html: body, // HTML content of the email
            text: text // Plain text content of the email
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Use the MailerSend API token securely
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Email sent successfully:', data);
        res.send({ success: true, data: data });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
