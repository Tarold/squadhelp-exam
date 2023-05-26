const winston = require('winston');
const { format, transports } = require('winston');
const { combine, printf, errors } = format;

const myFormat = printf(({ message, code, stack }) => {
  return JSON.stringify({
    message: message,
    time: Date.now(),
    code: code,
    stackTrace: { stack },
  });
});

const logConfiguration = {
  transports: [
    new transports.File({
      level: 'error',
      format: combine(errors({ stack: true }), myFormat),
      filename: 'logs/example.log',
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);

// const logFormat = printf(({ level, message, timestamp }) => {
//   return JSON.stringify({
//     message,
//     time: timestamp,
//     code: '',
//     stackTrace: {},
//   });
// });

module.exports = logger;
