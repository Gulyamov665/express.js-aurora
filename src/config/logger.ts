import morgan from "morgan";
import winston from "winston";

const date = new Date();
const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
const morganFormat =
  ':remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":user-agent"';

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `logs/${formatDate(date)}.log` }),
  ],
});

export const logging = morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});
