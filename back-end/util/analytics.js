const axios = require("axios");
const logger = require("../util/logger");
const Analytics = require("../models/analytics");
const moment = require("moment");
const HttpError = require("../models/http-error");

const getUserAnalyticsInfo = async () => {
  let options = {
    method: "GET",
    url: `${process.env.IPINFO}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(options);
    const data = response.data;

    return data;
  } catch (err) {
    logger.log("error", "Error getting user info", { metadata: err.message });
  }
};

const setAnalytics = async (analytics, businessId, type) => {
  const { city, country, ip, postal, region, timezone } = analytics;

  let existingAnalytics;

  try {
    existingAnalytics = await Analytics.findOne({ ip: ip })
      .limit(1)
      .sort({ $natural: -1 });
  } catch (err) {
    logger.log("error", "Unable to get analytics", { metadata: err.message });
    const error = new HttpError("Not found!", 402);
    return next(error);
  }

  let lastVisit;

  let currentTime = moment();

  if (existingAnalytics) {
    lastVisit = moment(existingAnalytics.timestamp);
  }

  let duration = moment.duration(currentTime.diff(lastVisit));
  let minutes = duration.asMinutes();
  let added = false;

  const createdAnalytics = new Analytics({
    ip,
    postal,
    city,
    country,
    region,
    timezone,
    businessId,
    type: type,
  });

  if (existingAnalytics) {
    if (existingAnalytics.businessId != businessId.toString()) {
      try {
        await createdAnalytics.save();
        added = true;
      } catch (err) {
        console.log(err);
        const error = new HttpError("Unable to create analytics!", 402);
        return next(error);
      }
    } else {
      if (minutes > 5) {
        try {
          await createdAnalytics.save();
          added = true;
        } catch (err) {
          console.log(err);
          const error = new HttpError("Unable to create analytics!", 402);
          return next(error);
        }
      } else if (existingAnalytics.type != type) {
        try {
          await createdAnalytics.save();
          added = true;
        } catch (err) {
          console.log(err);
          const error = new HttpError("Unable to create analytics!", 402);
          return next(error);
        }
      }
    }
  } else {
    try {
      await createdAnalytics.save();
      added = true;
    } catch (err) {
      console.log(err);
      const error = new HttpError("Unable to create analytics!", 402);
      return next(error);
    }
  }
};

exports.setAnalytics = setAnalytics;
exports.getUserAnalyticsInfo = getUserAnalyticsInfo;
