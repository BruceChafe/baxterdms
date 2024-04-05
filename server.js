import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
