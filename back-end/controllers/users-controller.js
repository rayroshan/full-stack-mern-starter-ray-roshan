const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const language = require("../util/language.json");
const logger = require("../util/logger");
const moment = require("moment");
const path = require("path");
const { ObjectId } = require("mongodb");
const { getUserAnalyticsInfo } = require("../util/analytics");
const { uid } = require("uid");
const { validationResult } = require("express-validator");

const {
  getUser,
  normalizePhoneNumber,
  generateSlug,
} = require("../util/utilities");

const getUserById = async (req, res, next) => {
  const { userId } = req.query;

  if (!userId || !ObjectId.isValid(userId)) {
    const error = new HttpError(language.en.errors.generic.error, 422);
    return next(error);
  }

  let user = null,
    criteria = {
      _id: 1,
      business: 1,
      customerId: 1,
      email: 1,
      firstname: 1,
      lastname: 1,
      phone: 1,
      receiveNotifications: 1,
      receivePromotions: 1,
      signedup: 1,
    };

  try {
    user = await User.findOne({ _id: ObjectId(userId) }, criteria);
  } catch (err) {
    logger.log("error", `Unable to get user for userID: ${user._id}`, {
      metadata: err.message,
    });
    const error = new HttpError(language.en.errors.users.userNotFound, 402);
    return next(error);
  }

  res.json({ user });
};

const updatePersonalInformation = async (req, res, next) => {
  const { userId, firstname, lastname } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(language.en.errors.generic.error, 422));
  }

  if (!userId) {
    return next(new HttpError(language.en.errors.generic.error, 422));
  }

  let user;

  try {
    user = await User.updateOne(
      {
        _id: ObjectId(userId),
      },
      {
        $set: {
          firstname,
          lastname,
        },
      }
    );
  } catch (err) {
    logger.log(
      "error",
      `Unable get user to update info for userId: ${userId}`,
      { metadata: err.message }
    );
    const error = new HttpError(language.en.errors.users.userUpdateError, 500);
    return next(error);
  }

  res.json(true);
};

const updateAccountInformation = async (req, res, next) => {
  const { userId, receiveNotifications, receivePromotions } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(language.en.errors.generic.error, 422));
  }

  if (!userId) {
    return next(new HttpError(language.en.errors.generic.error, 422));
  }

  let user;

  try {
    user = await User.updateOne(
      {
        _id: ObjectId(userId),
      },
      {
        $set: {
          receivePromotions,
          receiveNotifications,
        },
      }
    );
  } catch (err) {
    logger.log(
      "error",
      `Unable get user to update info for userId: ${userId}`,
      { metadata: err.message }
    );
    const error = new HttpError(language.en.errors.users.userUpdateError, 500);
    return next(error);
  }

  res.json(true);
};

exports.getUserById = getUserById;
exports.updatePersonalInformation = updatePersonalInformation;
exports.updateAccountInformation = updateAccountInformation;
