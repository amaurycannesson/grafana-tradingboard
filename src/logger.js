const winston = require("winston");

const { combine, timestamp, ms, colorize, printf, errors } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp(),
    errors({ stack: true }),
    ms(),
    printf(
      ({ timestamp, level, message, ms }) =>
        `${timestamp} ${level} ${message} ${ms}`
    )
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
