const winston = require('winston');
const fs = require('fs');
const { format, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, printf, errors } = format;
const CONSTANTS = require('../constants');
const path = require('path');
const readline = require('readline');

const logFormat = printf(({ message, code, stack }) => {
  stack = stack.split('\n    ').slice(1);
  return JSON.stringify({
    message: message,
    time: Date.now(),
    code: code,
    stackTrace: { ...stack },
  });
});

const dailyRotateFormat = data => {
  const { message, code, time } = JSON.parse(data);
  return JSON.stringify({
    message,
    code,
    time,
  });
};

const dailyRotateTransport = new transports.DailyRotateFile({
  filename: `%DATE%.log`,
  dirname: CONSTANTS.LOG_DIR,
  datePattern: `YYYY-MM-DD`,
  maxSize: `20m`,
  maxFiles: `14d`,
});

const logsToNewFile = newFilename => {
  const inputFile = path.join(CONSTANTS.LOG_DIR, CONSTANTS.LOG_FILE);

  if (fs.existsSync(inputFile)) {
    const readFile = readline.createInterface({
      input: fs.createReadStream(inputFile),
      console: false,
    });
    let data = '';

    readFile
      .on('line', line => {
        data += dailyRotateFormat(line) + '\n';
      })
      .on('close', () => {
        fs.appendFile(newFilename, data, function () {});
        fs.truncate(inputFile, 0, function () {});
      });
  }
};

dailyRotateTransport.on('new', function (newFilename) {
  logsToNewFile(newFilename);
});

dailyRotateTransport.on('rotate', function (oldFilename, newFilename) {
  logsToNewFile(newFilename);
});

const logConfiguration = {
  transports: [
    new transports.File({
      format: combine(errors({ stack: true }), logFormat),
      filename: CONSTANTS.LOG_FILE,
      dirname: CONSTANTS.LOG_DIR,
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);

module.exports = logger;
