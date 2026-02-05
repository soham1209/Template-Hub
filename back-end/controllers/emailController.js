// backend/controllers/emailController.js
import nodemailer from 'nodemailer';
import db from '../config/db.js';
import generateHTML from '../utils/emailGenerator.js';

// Configure the transporter (The "Postman")
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 465, // Default to 465 if missing
  secure: process.env.SMTP_PORT == 465, // Use SSL for port 465
  auth: {
    user: process.env.EMAIL_USER || process.env.SMTP_USER, // Check both env names just in case
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS
  },
  // KEY FIX 1: Identify as your domain to avoid "localhost" bot detection
  name: 'soniinfo.com', 
  // debug: true,
  // logger: true,
  tls: {
    // Helps with self-signed certificate errors on some shared hosting
    rejectUnauthorized: false 
  }
});

export const sendEmail = async (req, res) => {
  // Extract 'recipient' (matches frontend)
  const { templateId, recipient, contextData } = req.body;

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
    
    // KEY FIX 2: Generate a plain text version for anti-spam filters
    const plainTextContent = `
      Hello ${userContext.name},
      
      You are viewing the text version of this email. 
      Please enable HTML to view the full design.
      
      © ${userContext.year} ${userContext.company}
    `;

    // 3. Define Email Options
    const mailOptions = {
      from: `"MailForge System" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`, 
      to: recipient, 
      subject: template.subject || 'Project Update: Template Design', 
      text: plainTextContent, // Required for better deliverability
      html: emailHtml, 
    };

    // 4. Send the email
    const info = await transporter.sendMail(mailOptions);

    // console.log('✅ Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully!', messageId: info.messageId });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};