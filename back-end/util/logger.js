const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(format.timestamp(), format.json()),
    }),
    ,
    new transports.File({
      filename: "info.log",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.MongoDB({
      db: process.env.DB,
      collection: "logs",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
