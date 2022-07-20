const HttpError = require("../models/http-error");
const sgMail = require("@sendgrid/mail");
const logger = require("../util/logger");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, name, uniqueId, emailType) => {
  let msg = {
    to: to,
    from: {
      email: process.env.PROJECT_EMAIL,
      name: process.env.PROJECT,
    },
  };

  switch (emailType) {
    case "VERIFICATION":
      msg = {
        ...msg,
        templateId: process.env.SENDGRID_VERIFICATION_EMAIL_TEMPLATE_ID,
        dynamic_template_data: {
          name: name,
          link: `${process.env.BASE_URL}/auth/signup/verification/${uniqueId}`,
        },
      };

      break;

    case "RESET":
      msg = {
        ...msg,
        templateId: process.env.SENDGRID_RESET_PASSWORD_EMAIL_TEMPLATE_ID,
        dynamic_template_data: {
          name: name,
          link: `${process.env.BASE_URL}/auth/recover/${uniqueId}`,
        },
      };

      break;
    default:
  }

  sgMail
    .send(msg)
    .then(() => {
      // console.log('Email sent')
    })
    .catch((error) => {
      logger.log("error", `Unable to send email`, { metadata: error });
    });
};

exports.sendEmail = sendEmail;
