const winston = require('winston');
const { format, transports } = require('winston');
const { combine, printf, errors } = format;

const myFormat = printf(({ message, code, stack }) => {
  stack = stack.split('\n    ').slice(1);
  return JSON.stringify({
    message: message,
    time: Date.now(),
    code: code,
    stackTrace: { ...stack },
  });
});

const logConfiguration = {
  transports: [
    new transports.File({
      format: combine(errors({ stack: true }), myFormat),
      filename: 'logs/example.log',
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);

module.exports = logger;
