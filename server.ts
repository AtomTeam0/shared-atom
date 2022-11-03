import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";
import * as cors from "cors";
import * as winston from "winston";
import { Router } from "express";
import * as jayson from "jayson/promise";
import {
  userErrorHandler,
  serverErrorHandler,
  unknownErrorHandler,
} from "./utils/errors/errorHandler";
import { initLogger } from "./utils/helpers/logger";
import { IServerConfig } from "./interfaces/helpers/serverConfig.interface";
import { setSocketServer } from "./utils/schema/helpers/socketHelpers";
import { createContext } from "./utils/helpers/context";

export class Server {
  public app: express.Application;

  private config: IServerConfig;

  private server: http.Server;

  private logger: winston.Logger;

  public static bootstrap(
    config: IServerConfig,
    router: Router,
    RpcServer?: jayson.Server,
    isSocket = false
  ): Server {
    return new Server(config, router, RpcServer, isSocket);
  }

  private constructor(
    config: IServerConfig,
    router: Router,
    RpcServer?: jayson.Server,
    isSocket = false
  ) {
    // handle express
    this.app = express();
    this.config = config;
    this.logger = initLogger(config);
    this.configureMiddlewares();
    this.app.use(
      (
        error: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        createContext();
        next();
      }
    );
    this.app.use(router);
    this.initializeErrorHandler();
    this.server = http.createServer(this.app);
    this.server.listen(this.config.server.port, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } environment on port ${this.config.server.port}`
      );
      this.log(
        "info",
        `Server running in ${
          process.env.NODE_ENV || "development"
        } environment on port ${this.config.server.port}`,
        "server started"
      );
    });
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // handle RPC
    if (RpcServer) {
      RpcServer.http().listen(this.config.rpc?.port, () => {
        console.log(`RPC server running on port ${this.config.rpc?.port}`);
        this.log(
          "info",
          `RPC server running on port ${this.config.rpc?.port}`,
          "RPC server started"
        );
      });
    }

    if (isSocket) {
      setSocketServer(this.server);
    }
  }

  private configureMiddlewares() {
    const corsOptions: cors.CorsOptions = {
      origin: this.config.cors.allowedOrigins,
    };
    this.app.use(cors(corsOptions));

    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }

    this.app.use(express.json({ limit: "500mb" }));
    this.app.use(bodyParser.json({ limit: "500mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeErrorHandler() {
    this.app.use(userErrorHandler(this.log));
    this.app.use(serverErrorHandler(this.log));
    this.app.use(unknownErrorHandler(this.log));
  }

  public log = (
    severity: string,
    name: string,
    description: string,
    correlationId?: string,
    user?: string,
    more?: object
  ) => {
    this.logger.log({
      name,
      correlationId,
      user,
      level: severity,
      message: description,
      ...more,
    });
  };
}
