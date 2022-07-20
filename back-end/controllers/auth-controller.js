const Email = require("../util/email");
const HttpError = require("../models/http-error");
const SMS = require("../util/sms");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const language = require("../util/language.json");
const logger = require("../util/logger");
const moment = require("moment");
const path = require("path");
const slugify = require("slugify");
const { ObjectId } = require("mongodb");
const { getUserAnalyticsInfo } = require("../util/analytics");
const { phone } = require("phone");
const { uid } = require("uid");
const { validationResult } = require("express-validator");

const {
  getUser,
  normalizePhoneNumber,
  generateSlug,
} = require("../util/utilities");

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(language.en.errors.auth.invalidInputs, 422));
  }

  const { firstname, lastname, email, phoneNumber, password } = req.body;

  let user,
    currentPhone = normalizePhoneNumber(phoneNumber),
    hashedPassword,
    slug,
    analytics,
    token;

  try {
    user = await getUser(email, currentPhone);
  } catch (err) {
    const error = new HttpError(language.en.errors.auth.generic, 500);

    logger.log("error", `Unable to check if the user exists`, {
      metadata: err.message,
    });

    return next(error);
  }

  if (user) {
    const error = new HttpError(language.en.errors.auth.userExists, 422);
    return next(error);
  }

  try {
    hashedPassword = await bcrypt.hash(password, 12);
    slug = generateSlug([firstname, lastname]);
  } catch (err) {
    const error = new HttpError(language.en.errors.auth.generic, 500);
    logger.log("error", `Unable to create slug or hash password for user`, {
      metadata: err.message,
    });
    return next(error);
  }

  try {
    analytics = await getUserAnalyticsInfo();
  } catch (err) {
    logger.log("error", `Unable to get analytics for user`, {
      metadata: err.message,
    });
  }

  const createdUser = new User({
    email,
    emailToken: crypto.randomBytes(64).toString("hex"),
    firstname,
    lastname,
    password: hashedPassword,
    phone: currentPhone,
    referral: uid(16),
    signupIp: analytics?.ip,
    slug: slug,
    emailVerified: false,
    phoneVerified: false,
    role: "CUSTOMER",
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(language.en.errors.auth.signUpError, 500);
    return next(error);
  }

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "20d" }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(language.en.errors.auth.signUpError, 500);
    return next(error);
  }

  try {
    const email = await Email.sendEmail(
      createdUser.email,
      createdUser.firstname,
      createdUser.emailToken,
      "VERIFICATION"
    );
    const sms = await SMS.sendVerificationSMS(createdUser.phone);
  } catch (err) {
    logger.log("error", `Unable to send verification sms or email`, {
      metadata: err.message,
    });

    const error = new HttpError(language.en.errors.auth.verificationError, 402);

    return next(error);
  }

  res.status(201).json({ _id: createdUser._id, phone: createdUser.phone });
};

const signin = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(language.en.errors.auth.invalidInputs, 422));
  }

  const { phoneNumber, password } = req.body;

  let user,
    token,
    currentPhone = normalizePhoneNumber(phoneNumber),
    userInfo = null,
    isValidPassword = false;

  try {
    user = await getUser(null, currentPhone);
  } catch (err) {
    const error = new HttpError(language.en.errors.auth.signinError, 500);

    logger.log(
      "error",
      `Unable to check if the user exists with email: ${email}`,
      {
        metadata: err.message,
      }
    );

    return next(error);
  }

  if (!user) {
    const error = new HttpError(language.en.errors.auth.noAccount, 401);
    return next(error);
  }

  if (!user.active) {
    const error = new HttpError(language.en.errors.auth.disabledAccount, 401);
    return next(error);
  }

  if (user.phoneVerified) {
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
    } catch (err) {
      const error = new HttpError(language.en.errors.auth.loginError, 500);
      return next(error);
    }

    if (!isValidPassword) {
      const error = new HttpError(
        language.en.errors.auth.loginCredentialsError,
        401
      );

      return next(error);
    }

    try {
      token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "20d",
        }
      );
    } catch (err) {
      const error = new HttpError(language.en.errors.auth.loginError, 500);
      return next(error);
    }

    userInfo = {
      role: user.role,
      email: user.email,
      emailVerified: user.emailVerified,
      firstname: user.firstname,
      image: user.image,
      initialized: user.initialized,
      lastname: user.lastname,
      phone: user.phone,
      token: token,
      userId: user.id,
    };
  } else {
    try {
      const sms = await SMS.sendVerificationSMS(currentPhone);
    } catch (err) {
      logger.log(
        "error",
        `Unable to send verification code to phone: ${phoneNumber}`,
        { metadata: err.message }
      );

      const error = new HttpError(
        language.en.errors.auth.phoneNumberVerificationError,
        500
      );
    }
  }

  res.json(userInfo);
};

const verifySMS = async (req, res, next) => {
  const { phoneNumber, verification } = req.query;

  let currentPhone = normalizePhoneNumber(phoneNumber),
    status,
    user;

  try {
    status = await SMS.verifySMS(currentPhone, verification);
  } catch (err) {
    logger.log("error", `Unable to send verification`, {
      metadata: err.message,
    });

    const error = new HttpError(language.en.errors.auth.generic, 500);
    return next(error);
  }

  if (status == "approved") {
    try {
      user = await User.findOne({ phone: currentPhone });
    } catch (err) {
      logger.log(
        "error",
        `User with phone number was not found: ${currentPhone}`,
        { metadata: err.message }
      );

      const error = new HttpError(language.en.errors.auth.generic, 500);
      return next(error);
    }

    if (!user) {
      const error = new HttpError(
        language.en.errors.auth.verificationError,
        401
      );

      return next(error);
    } else {
      if (!user.phoneVerified) {
        user.phoneVerified = true;
        try {
          await user.save();
        } catch (err) {
          logger.log("error", `Unable to verify the user ID: ${user._id}`, {
            metadata: err.message,
          });

          const error = new HttpError(
            language.en.errors.auth.verificationError,
            500
          );
          return next(error);
        }
      }
    }
  }

  res.json(status);
};

const sendVerification = async (req, res, next) => {
  const { phoneNumber } = req.query;

  let currentPhone = normalizePhoneNumber(phoneNumber),
    user;

  try {
    user = await User.findOne({ phone: currentPhone });
  } catch (err) {
    logger.log("error", `Unable to verify phone: ${phoneNumber}`, {
      metadata: err.message,
    });

    const error = new HttpError(
      language.en.errors.auth.phoneNumberVerificationError,
      500
    );
    return next(error);
  }

  if (!user) {
    return next(
      new HttpError(language.en.errors.auth.phoneNumberVerificationError, 422)
    );
  }

  if (user?.phoneVerified) {
    return next(
      new HttpError(language.en.errors.auth.phoneAlreadyVerified, 422)
    );
  }

  try {
    const sms = await SMS.sendVerificationSMS(currentPhone);
  } catch (err) {
    logger.log(
      "error",
      `Unable to send verification code to phone: ${phoneNumber}`,
      { metadata: err.message }
    );

    const error = new HttpError(
      language.en.errors.auth.phoneNumberVerificationError,
      500
    );
  }

  res.json(true);
};

const verifyEmail = async (req, res, next) => {
  const { uniqueId } = req.body;

  let user;

  try {
    user = await User.findOne({ emailToken: uniqueId });
  } catch (err) {
    const error = new HttpError("User was not found!", 402);

    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      language.en.errors.auth.emailVerificationError,
      401
    );

    return next(error);
  } else {
    if (!user.emailVerified) {
      user.emailVerified = true;
      try {
        await user.save();
      } catch (err) {
        logger.log("error", `Unable to verify the user ID: ${user._id}`, {
          metadata: err.message,
        });

        const error = new HttpError(
          language.en.errors.auth.emailVerificationError,
          500
        );
        return next(error);
      }
    }
  }

  res.status(201).json({
    status: "success",
  });
};

const resetPassword = async (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(language.en.errors.auth.invalidInputs, 422));
  }

  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    logger.log(
      "error",
      `Unable get user to change password for email: ${email}`,
      { metadata: err.message }
    );
    const error = new HttpError(language.en.errors.auth.generic, 402);
    return next(error);
  }

  if (!user) {
    const error = new HttpError(language.en.errors.auth.noAccount, 402);
    return next(error);
  } else {
    if (!user.lastPasswordReset) {
      const token = crypto.randomBytes(64).toString("hex");
      user.lastPasswordReset = Date.now();
      user.passwordToken = token;
      user.passwordTokenUsed = false;

      try {
        await user.save();
        const email = await Email.sendEmail(
          user.email,
          user.firstname,
          token,
          "RESET"
        );
      } catch (err) {
        logger.log(
          "error",
          `Unable to reset password for the user ID: ${user._id}`,
          { metadata: err.message }
        );

        const error = new HttpError(
          language.en.errors.auth.resetPasswordError,
          500
        );
        return next(error);
      }
    } else {
      let currentTime = moment();
      lastVisit = moment(user.lastPasswordReset);
      let duration = moment.duration(currentTime.diff(lastVisit));
      let minutes = duration.asMinutes();

      if (minutes > 15) {
        const token = crypto.randomBytes(64).toString("hex");
        user.lastPasswordReset = Date.now();
        user.passwordToken = token;
        user.passwordTokenUsed = false;

        try {
          await user.save();
          const email = await Email.sendEmail(
            user.email,
            user.firstname,
            token,
            "RESET"
          );
        } catch (err) {
          logger.log(
            "error",
            `Unable to reset password for the user ID: ${user?._id}`,
            { metadata: err?.message }
          );

          const error = new HttpError(
            language.en.errors.auth.resetPasswordError,
            500
          );
          return next(error);
        }
      } else {
        const error = new HttpError(
          language.en.errors.auth.resetPasswordDelay,
          500
        );
        return next(error);
      }
    }
  }

  res.status(201).json({
    status: "success",
  });
};

const validatePassword = async (req, res, next) => {
  const { uniqueId } = req.query;
  const { newPassword, confirmPassword, captcha } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  if (newPassword != confirmPassword) {
    return next(
      new HttpError(
        "Passwords do not match, please confirm your new password.",
        422
      )
    );
  }

  let user;
  let hashedPassword;

  if (uniqueId) {
    try {
      user = await User.findOne({ passwordToken: uniqueId });
      let currentTime = moment();

      if (user && !user.passwordTokenUsed) {
        lastVisit = moment(user.lastPasswordReset);
        let duration = moment.duration(currentTime.diff(lastVisit));
        let minutes = duration.asMinutes();

        if (minutes < 15) {
          try {
            hashedPassword = await bcrypt.hash(newPassword, 12);
          } catch (err) {
            const error = new HttpError(
              "Could not update password, please try again",
              500
            );

            return next(error);
          }

          user.password = hashedPassword;
          user.passwordTokenUsed = true;

          try {
            await user.save();
          } catch (err) {
            const error = new HttpError(
              "Password change failed, please try again.",
              500
            );
            return next(error);
          }
        } else {
          const error = new HttpError(
            "Your link is expired, please try resetting your password again.",
            402
          );
          return next(error);
        }
      } else {
        const error = new HttpError(
          "Your link is expired. Please try resetting your password.",
          402
        );
        return next(error);
      }
    } catch (err) {
      logger.log(
        "error",
        `Unable to update password for user ID: ${user._id}`,
        { metadata: err.message }
      );

      const error = new HttpError(
        "Unable to update password. Please try again later",
        402
      );
      return next(error);
    }
  } else {
    const error = new HttpError("Please try resetting your password", 402);

    return next(error);
  }

  res.json(true);
};

const changePassword = async (req, res, next) => {
  const { userId, oldPassword, newPassword, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(language.en.errors.generic.error, 422));
  }

  if (!userId) {
    return next(new HttpError(language.en.errors.generic.error, 422));
  }

  if (newPassword != confirmPassword) {
    return next(
      new HttpError(language.en.errors.auth.passwordConfirmationError, 422)
    );
  }

  let user;

  try {
    user = await User.findOne({ _id: ObjectId(userId) });
  } catch (err) {
    logger.log(
      "error",
      `Unable get user to change password for userId: ${userId}`,
      { metadata: err.message }
    );
    const error = new HttpError(language.en.errors.generic.error, 500);
    return next(error);
  }

  if (!user) {
    return next(new HttpError("Please login.", 422));
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(oldPassword, user.password);
  } catch (err) {
    const error = new HttpError(language.en.errors.generic.error, 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(language.en.errors.auth.oldPasswordError, 401);

    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      language.en.errors.auth.changePasswordError,
      500
    );
    return next(error);
  }

  try {
    user.password = hashedPassword;
    await user.save();
  } catch (err) {
    const error = new HttpError(
      language.en.errors.auth.changePasswordError,
      500
    );
    return next(error);
  }

  res.json(true);
};

exports.signup = signup;
exports.signin = signin;
exports.verifySMS = verifySMS;
exports.sendVerification = sendVerification;
exports.verifyEmail = verifyEmail;
exports.resetPassword = resetPassword;
exports.validatePassword = validatePassword;
exports.changePassword = changePassword;
