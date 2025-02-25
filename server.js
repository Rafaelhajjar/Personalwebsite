// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'personal-website.html'));
});

// Handle contact form submission
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Create email transporter
    // Note: For production, use your actual email service credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email service
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables for security
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Email options
    const mailOptions = {
      from: email,
      to: 'your.email@example.com', // Replace with your email
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Next step: Set up environment variables for email credentials 