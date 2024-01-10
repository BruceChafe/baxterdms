import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());

// API endpoint for sending emails
app.post('/send-email', async (req, res) => {
  const { to, from, body, subject } = req.body;

  // Set up your nodemailer transporter and mailOptions here
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'baxterdms@outlook.com',
            pass: 'Diet1989Coke!',
        },
  });

  const mailOptions = {
    from,
    to,
    // cc: ccc,
    // bcc,
    subject: subject,
    text: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    res.send({ success: true });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
