import * as winston from "winston";
import * as os from "os";

export const initLogger = (config: any) => {
  const logger = winston.createLogger({
    defaultMeta: { service: config.server.name, hostname: os.hostname() },
  });

  const winstonConsole = new winston.transports.Console({
    level: "silly",
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.json()
    ),
  });

  logger.add(winstonConsole);
  return logger;
};
