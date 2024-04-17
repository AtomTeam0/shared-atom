import {createLogger, format, transports} from "winston";
import { hostname } from "os";

export const initLogger = (config: any) => {
  const logger = createLogger({
    defaultMeta: { service: config.server.name, hostname: hostname() },
  });

  const winstonConsole = new transports.Console({
    level: "silly",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.json()
    ),
  });

  logger.add(winstonConsole);
  return logger;
};
