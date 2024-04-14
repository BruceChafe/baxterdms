import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { connectToDatabase } from './utilities/mongodb.js';
import fetch from 'node-fetch'; // Ensure you have 'node-fetch' installed

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Proxy endpoint to MongoDB Atlas Data API
app.post('/api/data/contacts', async (req, res) => {
    const url = 'https://data.mongodb-api.com/app/data-ohuxb/endpoint/data/v1/action/find';
    const apiKey = 'your_api_key_here'; // Be sure to secure your API key, ideally load from environment variables
    const body = {
        collection: "contacts",
        database: "baxterdms",
        dataSource: "baxterDMS",
    };

    try {
        const mongoResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify(body)
        });

        const data = await mongoResponse.json();
        res.status(mongoResponse.status).send(data);
    } catch (error) {
        console.error("Proxy to MongoDB Data API failed:", error);
        res.status(500).send({ error: "Failed to fetch data from MongoDB Data API" });
    }
});

// Endpoint to send emails
app.post('/send-email', async (req, res) => {
    console.log("Received request to send email");
    const { to, from, body, subject, config } = req.body;

    if (!config || !config.emailUser || !config.emailPass) {
        return res.status(400).send({ success: false, error: "Email configuration is missing." });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: config.emailUser,
                pass: config.emailPass,
            },
        });

        const mailOptions = {
            from, // Sender address
            to, // List of recipients
            subject, // Subject line
            text: body, // Plain text body
        };

        // Send email with defined transport object
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        res.send({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
