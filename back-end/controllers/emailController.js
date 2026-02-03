// backend/controllers/emailController.js
const nodemailer = require('nodemailer');
const db = require('../config/db');
const generateHTML = require('../utils/emailGenerator');

// Configure the transporter (The "Postman")
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. smtp.hostinger.com
  port: process.env.SMTP_PORT, // e.g. 465
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // ADD THESE TWO LINES:
  debug: true,
  logger: true
});

// @desc    Send a template to a recipient
// @route   POST /api/email/send
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
    // (Parse sections if they are returned as string from MySQL)
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
      from: `"MailForge" <${process.env.EMAIL_USER}>`, // Sender address
      to: recipientEmail, // List of receivers
      subject: template.subject || 'No Subject', // Subject line
      html: emailHtml, // The HTML body we generated
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