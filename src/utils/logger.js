const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    // File transport
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Function to log info messages
const logInfo = (message) => {
  logger.info(message);
};

// Function to log error messages
const logError = (message) => {
  logger.error(message);
};

// Export the logger and logging functions
module.exports = {
  logger,
  logInfo,
  logError,
};