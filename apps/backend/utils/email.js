// const sendEmail = async (options) => {
//   // 1. Create a transporter
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   // 2. Define the email options
//   const mailOptions = {
//     from: "ShopIT <  >",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   // 3. Actually send the email
//   await transporter.sendMail(mailOptions);
// };

const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transport = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(transport);
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(message);
};

module.exports = sendEmail;
