import nodemailer from "nodemailer";
import { IUser } from "../models/user";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // Use STARTTLS with port 587
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Optional: Check if transporter is ready
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send emails");
  }
});

// Send Verification Email
export const sendVerificationEmail = async (
  user: IUser,
  token: string
): Promise<void> => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Verify Your Email",
    html: `
   <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Josefin+Sans:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #f6f9fc 0%, #eef2f6 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .container {
      max-inline-size: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
      padding: 48px;
      text-align: center;
      border: 1px solid rgba(0, 0, 0, 0.03);
    }
    .header {
      margin-block-end: 32px;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #2563eb;
      margin-block-end: 24px;
      display: inline-block;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 24px 0;
      line-height: 1.3;
    }
    p {
      font-size: 16px;
      margin-BLOCK-bottom: 24px;
      color: #4b5563;
    }
    a.button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #fff !important;
      padding: 16px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -1px rgba(59, 130, 246, 0.06);
      margin: 16px 0;
    }
    a.button:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.05);
    }
    .expiry {
      font-size: 14px;
      color: #6b7280;
      margin: 24px 0;
    }
    .footer {
      margin-block-top: 48px;
      font-size: 13px;
      color: #9ca3af;
      border-block-top: 1px solid #e5e7eb;
      padding-block-top: 24px;
    }
    .highlight {
      background-color: rgba(59, 130, 246, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
      color: #2563eb;
    }
    .emoji {
      font-size: 24px;
      margin-block-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Marknic Credit</div>
      <div class="emoji">✨</div>
    </div>
    
    <h1>Let's get you verified!</h1>
    
    <p>Hey <span class="highlight">${user.name || "there"}</span>,</p>
    
    <p>
      Thanks for joining us! Just one quick click to verify your email and you're all set:
    </p>
    
    <a href="${verificationUrl}" class="button">Confirm My Email</a>
    
    <div class="expiry">
      ⏳ Link expires in 1 hour
    </div>
    
    <div class="footer">
      If you didn't request this, feel free to ignore this email.<br>
      Questions? <a href="mailto:support@yourbrand.com" style="color: #6b7280; text-decoration: underline;">We're here to help</a>.
    </div>
  </div>
</body>
    `,
  });
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (
  user: IUser,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`; // Construct the reset URL

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h1>Reset Your Password</h1>
      <p>Hello ${
        user.name || ""
      }, click the link below to reset your password:</p> 
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};
