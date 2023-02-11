import transporter from "../config/transporter.config";
import config from "../config/index";

const mailHelper = async (options) => {
  const message = {
    from: config.SMTP_MAIL_EMAIL, //sender address
    to: options.email, //receiver address
    subject: options.subject, //subject line
    text: options.text, //plain text body
    // html: "<b>Hello World?</b>", //html body
  };

  await transporter.sendMail(message);
};

export default mailHelper;
