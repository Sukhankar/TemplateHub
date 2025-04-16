import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Define Mongoose Schema for Contact Messages
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Save contact message to MongoDB
    const contactData = new Contact({ name, email, message });
    await contactData.save();

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 5px;">${message}</p>
        </div>
      `
    });

    // Send confirmation email to sender
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting us, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">We've received your message</h2>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to us. We've received your message and will get back to you soon.</p>
          <p>Here's a copy of your message:</p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 5px;">${message}</p>
          <p>Best regards,<br>Our Team</p>
        </div>
      `
    });

    res.status(200).json({ 
      message: "Message sent successfully!",
      data: {
        name,
        email,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error processing contact request:", error);
    res.status(500).json({ 
      error: "Something went wrong. Please try again later.",
      details: error.message 
    });
  }
};
