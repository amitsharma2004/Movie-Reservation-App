import winston from "winston";

const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  debug: "green",
};

winston.addColors(colors);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export default logger;