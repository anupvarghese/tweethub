const bunyan = require('bunyan');

const streams = [{ level: 'trace', stream: process.stdout }];

const logger = bunyan.createLogger({
  name: 'tweethub',
  environment: process.env.NODE_ENV,
  streams
});

module.exports = logger;
