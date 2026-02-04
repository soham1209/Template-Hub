// backend/controllers/emailController.js
const nodemailer = require('nodemailer');
const db = require('../config/db');
const generateHTML = require('../utils/emailGenerator');

// Configure the transporter (The "Postman")
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT, 
  secure: process.env.SMTP_PORT == 465, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
  logger: true
});

exports.sendEmail = async (req, res) => {
  const { templateId, recipientEmail, contextData } = req.body;

  try {
    // 1. Fetch the template from DB
    const [rows] = await db.query('SELECT * FROM templates WHERE id = ?', [templateId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    const template = rows[0];

    // 2. Generate the HTML
    const sections = typeof template.sections === 'string' 
      ? JSON.parse(template.sections) 
      : template.sections;
      
    // Use default mock data if contextData isn't provided
    const userContext = contextData || {
      name: 'Valued Customer',
      company: 'Sony Info Tech',
      role: 'Developer',
      year: new Date().getFullYear()
    };

    const emailHtml = generateHTML(sections, userContext);

    // 3. Define Email Options
    const mailOptions = {
      from: `"MailForge" <${process.env.EMAIL_USER}>`, 
      to: recipientEmail, 
      subject: template.subject || 'No Subject', 
      html: emailHtml, 
    };

    // 4. Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully!', messageId: info.messageId });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};