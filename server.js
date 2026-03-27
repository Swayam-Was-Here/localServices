import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── OTP Email ──────────────────────────────────────────────────────────────
app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code - Local Services',
    text: `Your OTP for registration is: ${otp}. This code will expire soon.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4f46e5;">Verification Code</h2>
        <p>Thank you for signing up for Local Services. Please use the following OTP to verify your email address:</p>
        <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f3f4f6; display: inline-block; border-radius: 5px;">
          ${otp}
        </div>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

// ── Bid Accepted Notification ──────────────────────────────────────────────
app.post('/send-bid-accepted', async (req, res) => {
  const { providerEmail, providerName, jobTitle, customerName, amount } = req.body;

  const mailOptions = {
    from: `"Local Services" <${process.env.EMAIL_USER}>`,
    to: providerEmail,
    subject: '🎉 Congratulations! Your Bid Has Been Accepted – Local Services',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #002045 0%, #003a75 100%); padding: 40px 32px; text-align: center;">
          <div style="font-size: 52px; margin-bottom: 12px;">🎉</div>
          <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0 0 8px;">Your Bid Was Accepted!</h1>
          <p style="color: rgba(255,255,255,0.75); font-size: 14px; margin: 0;">You have a new confirmed job on Local Services</p>
        </div>

        <!-- Body -->
        <div style="padding: 36px 32px;">
          <p style="font-size: 16px; color: #1a202c; margin: 0 0 16px;">Hi <strong>${providerName}</strong> 👋</p>
          <p style="font-size: 15px; color: #4a5568; line-height: 1.7; margin: 0 0 28px;">
            Great news! <strong>${customerName}</strong> has reviewed your proposal and selected <strong>you</strong> for the job.
            Your commitment and professionalism stood out — well done!
          </p>

          <!-- Job Details Card -->
          <div style="background: #ffffff; border-radius: 10px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
            <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin: 0 0 16px; font-weight: 700;">Job Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; width: 38%;">Service</td>
                <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #0f172a; font-size: 14px;">${jobTitle}</td>
              </tr>
              <tr>
                <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Customer</td>
                <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a; font-size: 14px;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 11px 0; color: #64748b; font-size: 14px;">Your Earnings</td>
                <td style="padding: 11px 0; font-weight: 800; color: #16a34a; font-size: 22px;">₹${amount}</td>
              </tr>
            </table>
          </div>

          <!-- Escrow Notice -->
          <div style="background: rgba(22,163,74,0.07); border: 1px solid rgba(22,163,74,0.25); border-radius: 8px; padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: flex-start; gap: 12px;">
            <div style="font-size: 20px; margin-top: 2px;">🔒</div>
            <div>
              <p style="font-size: 13px; font-weight: 700; color: #15803d; margin: 0 0 4px;">Payment in Escrow</p>
              <p style="font-size: 13px; color: #166534; margin: 0; line-height: 1.5;">₹${amount} has been securely reserved by the customer and will be released to you automatically upon job completion.</p>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 28px;">
            <a href="http://localhost:5173/provider-dashboard"
               style="display: inline-block; background: linear-gradient(135deg, #002045, #0050a0); color: #ffffff; padding: 15px 40px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; letter-spacing: 0.02em;">
              Open Your Dashboard →
            </a>
          </div>

          <p style="font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.7; margin: 0;">
            Good luck on the job! We're rooting for you.<br/>
            <strong style="color: #64748b;">The Local Services Team</strong> 🌟
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            © ${new Date().getFullYear()} Local Services · You're receiving this because you're a registered service provider.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Bid acceptance email sent successfully' });
  } catch (error) {
    console.error('Bid acceptance email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Local Services email server running on port ${PORT}`);
});
