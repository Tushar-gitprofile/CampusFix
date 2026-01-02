const nodemailer = require("nodemailer");

let transporterPromise = nodemailer.createTestAccount().then((testAccount) => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
});

const sendEmail = async ({ to, subject, text }) => {
  const transporter = await transporterPromise;

  const info = await transporter.sendMail({
    from: '"CampusFix" <no-reply@campusfix.com>',
    to,
    subject,
    text,
  });

  console.log("📧 Email Preview URL:", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
