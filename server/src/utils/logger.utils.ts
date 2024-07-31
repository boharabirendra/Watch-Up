import winston, { format, transports } from "winston";

const logFormat = format.printf(({ timestamp, level, message, metadata }) => {
  const formattedNamespace = metadata.namespace || "";
  return `${timestamp} [${level}] [${formattedNamespace}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.metadata({ fillExcept: ["timestamp", "level", "message"] }), // Fill metadata except specified fields
    logFormat
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs only errors
    new transports.File({ filename: 'logs/combined.log' }) // Logs all levels
  ],
});

const loggerWithNameSpace = (namespace: string) => {
  return logger.child({ metadata: { namespace } });
};

export default loggerWithNameSpace;
