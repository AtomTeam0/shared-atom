import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";
import * as cors from "cors";
import * as winston from "winston";
import { Router } from "express";
import * as jayson from "jayson/promise";
import { IServerConfig } from "common-atom/interfaces/helpers/serverConfig.interface";
import {
  userErrorHandler,
  serverErrorHandler,
  unknownErrorHandler,
} from "./utils/errors/errorHandler";
import { initLogger } from "./utils/helpers/logger";
import { setSocketServer } from "./utils/schema/helpers/socketHelpers";
import { runWithContextMiddleWare } from "./utils/helpers/context";
import { config } from "./config";

export class Server {
  public app: express.Application;

  private serverConfig: IServerConfig;

  private server: http.Server;

  private logger: winston.Logger;

  public static bootstrap(
    serverConfig: IServerConfig,
    router: Router,
    RpcServer?: jayson.Server,
    isSocket = false
  ): Server {
    return new Server(serverConfig, router, RpcServer, isSocket);
  }

  private constructor(
    serverConfig: IServerConfig,
    router: Router,
    RpcServer?: jayson.Server,
    isSocket = false
  ) {
    // handle express
    this.app = express();
    this.serverConfig = serverConfig;
    this.logger = initLogger(serverConfig);
    this.configureMiddlewares();
    this.app.use(runWithContextMiddleWare());
    this.app.use(router);
    this.initializeErrorHandler();
    this.server = http.createServer(this.app);
    this.server.listen(this.serverConfig.server.port, () => {
      console.log(
        `Server running in ${config.server.nodeEnv} environment on port ${this.serverConfig.server.port}`
      );
      this.log(
        "info",
        `Server running in ${config.server.nodeEnv} environment on port ${this.serverConfig.server.port}`,
        "server started"
      );
    });

    // handle RPC
    if (RpcServer) {
      RpcServer.http().listen(this.serverConfig.rpc?.port, () => {
        console.log(
          `RPC server running on port ${this.serverConfig.rpc?.port}`
        );
        this.log(
          "info",
          `RPC server running on port ${this.serverConfig.rpc?.port}`,
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
      origin: this.serverConfig.cors.allowedOrigins,
    };
    this.app.use(cors(corsOptions));

    if (config.server.nodeEnv === "development") {
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
