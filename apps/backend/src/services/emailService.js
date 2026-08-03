const nodemailer = require('nodemailer');

// Configure transporter – uses env vars for credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@dostel.com',
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
