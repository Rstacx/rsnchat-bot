const logger = require("pino");
const dayjs = require("dayjs");
const pinoPretty = require("pino-pretty");

const level = 'info';

const prettyStream = pinoPretty();

const log = logger({
  level,
}, prettyStream);

module.exports = log;