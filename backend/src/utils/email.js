const nodemailer = require("nodemailer");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.username.split(" ")[0]; // assumes that user's name is separated by space
    this.url = url;
    this.from = `Your App <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    return nodemailer.createTransport({
      service: "qq",
      auth: {
        user: process.env.EMAIL_USERNAME, // Your QQ email address
        pass: process.env.EMAIL_PASSWORD, // Your QQ SMTP-specific password
      },
    });
  }

  async send(subject, content) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: content,
    };

    try {
      await this.createTransport().sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }

  async sendWelcome() {
    await this.send(
      "Welcome to our App!",
      `
        <div>
            <p>Hello ${this.firstName},</p>
            <p>Please click on the following link to verify your email:</p>
            <a href="${this.url}">Verify Email</a>
        </div>
      `
    );
  }

  async sendPasswordReset() {
    await this.send(
      "Password Reset Request",
      `
        <div>
            <p>Hello ${this.firstName},</p>
            <p>We received a request to reset the password for your account. Please click the link below to reset your password:</p>
            <a href="${this.url}">Reset Password</a>
            <p>If you didn't request a password reset, please ignore this email or contact our support if you have concerns.</p>
        </div>
      `
    );
  }

  async sendDifferentDeviceLogin() {
    await this.send(
      "New Device Login Detected!",
      `
        <div>
            <p>Hello ${this.firstName},</p>
            <p>We noticed a login from a new device. If this was you, no further action is required. If you didn't recognize this login, please visit your account settings and update your password immediately.</p>
        </div>
      `
    );
  }
}

module.exports = Email;
