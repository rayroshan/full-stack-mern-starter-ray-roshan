const HttpError = require("../models/http-error");
const logger = require("./logger");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendVerificationSMS = async (phone) => {
  let status;
  try {
    status = await client.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" })
      .then((verification) => {
        // console.log(verification.status)
        return verification.status;
      });
  } catch (err) {
    throw err;
  }
  return status;
};

const verifySMS = async (phone, verificationCode) => {
  let status;
  try {
    status = await client.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: verificationCode })
      .then((verification_check) => {
        return verification_check?.status;
      });
  } catch (err) {
    console.log(err);
    throw err;
  }
  return status;
};

exports.sendVerificationSMS = sendVerificationSMS;
exports.verifySMS = verifySMS;
