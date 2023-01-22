const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;


const logger = createLogger({
  level: 'debug',
    format: combine(
      label({ label: 'right meow!' }),
      timestamp(),
      prettyPrint()
    ),
    transports: [new transports.Console(),
      new transports.File({
          filename: `logs/log1.log` })
      ]
  })
  
  logger.info({
    level: 'info',
    message: 'What time is the testing at?'
  });

  module.exports = logger;