const HttpError = require("../models/http-error");
const User = require("../models/user");
const language = require("../util/language.json");
const logger = require("../util/logger");
const slugify = require("slugify");
const { ObjectId } = require("mongodb");
const { phone } = require("phone");

const getUser = async (email, phone, slug, userId) => {
  let user;

  user = await User.findOne({
    $or: [
      { email: email },
      { phone: phone },
      { slug: slug },
      { _id: ObjectId(userId) },
    ],
  });

  return user;
};

const normalizePhoneNumber = (phoneNumber) => {
  let currentPhone = phoneNumber.toString().replace(/-/g, "").replace(/ /g, "");
  return phone(currentPhone, { country: "CA" })?.phoneNumber;
};

const generateSlug = (words) => {
  var allWords = words.join(", ");
  return (slug = slugify(allWords, {
    replacement: "-",
    lower: true,
    strict: true,
  }));
};

exports.getUser = getUser;
exports.normalizePhoneNumber = normalizePhoneNumber;
exports.generateSlug = generateSlug;
