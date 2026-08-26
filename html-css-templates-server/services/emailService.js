import nodemailer from "nodemailer";

const getTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback Ethereal / Console logger for local development
  return {
    sendMail: async (options) => {
      console.log("=========================================");
      console.log(`📧 [EMAIL MOCK SERVICE] To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`HTML: ${options.html}`);
      console.log("=========================================");
      return { messageId: "mock-email-id" };
    },
  };
};

export const sendOTPEmail = async (email, otp) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"TemplateHub" <${process.env.ADMIN_EMAIL || "noreply@templatehub.com"}>`,
    to: email,
    subject: "TemplateHub — Verify Your Email OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">Welcome to TemplateHub</h2>
        <p>Hello,</p>
        <p>Thank you for signing up. Please use the following 6-digit OTP code to verify your email address. This code is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827; background: #F3F4F6; padding: 10px 24px; border-radius: 8px;">${otp}</span>
        </div>
        <p style="color: #6B7280; font-size: 13px;">If you did not create an account, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"TemplateHub Security" <${process.env.ADMIN_EMAIL || "security@templatehub.com"}>`,
    to: email,
    subject: "TemplateHub — Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">TemplateHub Password Reset</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to choose a new password. The link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="word-break: break-all; font-size: 12px; color: #6B7280;">Or copy and paste this URL into your browser: <br>${resetUrl}</p>
        <p style="color: #6B7280; font-size: 13px;">If you did not request a password reset, no action is required.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (email, order) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"TemplateHub Orders" <${process.env.ADMIN_EMAIL || "orders@templatehub.com"}>`,
    to: email,
    subject: `TemplateHub — Order Receipt #${order.paymentId || order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #10B981; text-align: center;">Thank You for Your Order!</h2>
        <p>Your payment of <strong>$${order.totalAmount}</strong> was successfully processed.</p>
        <p>Order ID: <code>${order.paymentId || order._id}</code></p>
        <div style="margin: 20px 0; background: #F9FAFB; padding: 15px; border-radius: 6px;">
          <h4 style="margin-top:0;">Purchased Items:</h4>
          <ul>
            ${order.items?.map(item => `<li>${item.title || "Template"} (${item.license || "Personal"} License) — $${item.price}</li>`).join("")}
          </ul>
        </div>
        <p>You can access and redownload your template source files anytime from your account dashboard.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendSaleNotificationEmail = async (email, templateTitle, amount) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"TemplateHub Sales" <${process.env.ADMIN_EMAIL || "sales@templatehub.com"}>`,
    to: email,
    subject: `🎉 Congratulations! You made a new sale on TemplateHub`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">New Sale Notification!</h2>
        <p>Great news! Your template <strong>"${templateTitle}"</strong> was just purchased.</p>
        <p style="font-size: 18px; font-weight: bold; color: #10B981;">Your Earnings (80%): +$${amount.toFixed(2)}</p>
        <p>Earnings have been added to your seller account balance.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendTemplateStatusEmail = async (email, templateTitle, status, reason = "") => {
  const transporter = getTransporter();
  const isApproved = status === "approved";
  const mailOptions = {
    from: `"TemplateHub Moderation" <${process.env.ADMIN_EMAIL || "moderation@templatehub.com"}>`,
    to: email,
    subject: `TemplateHub — Template Submission ${isApproved ? "Approved! 🎉" : "Requires Revisions"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: ${isApproved ? "#10B981" : "#EF4444"}; text-align: center;">Template Submission Status</h2>
        <p>Your submission for <strong>"${templateTitle}"</strong> has been reviewed.</p>
        <p>Status: <strong style="text-transform: uppercase;">${status}</strong></p>
        ${!isApproved && reason ? `<p style="background: #FEF2F2; padding: 10px; border-left: 4px solid #EF4444; color: #991B1B;">Rejection Reason: ${reason}</p>` : ""}
        ${isApproved ? `<p>Your template is now live in the TemplateHub marketplace!</p>` : `<p>Please update your template files based on feedback and submit again.</p>`}
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
