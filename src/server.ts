import { json, urlencoded } from "body-parser";
import { IServerConfig } from "common-atom/interfaces/helpers/serverConfig.interface";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import http from "http";
import { Server as JaysonServer } from "jayson/promise";
import morgan from "morgan";
import { Logger } from "winston";
import { config } from "./config";
import { errorCatcherMiddleware } from "./utils/errors/Middlewares";
import { runWithContextMiddleWare } from "./utils/helpers/context";
import { initLogger } from "./utils/helpers/logger";
import { setSocketServer } from "./utils/schema/helpers/socketHelpers";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

export class Server {
  public app: express.Application;

  private serverConfig: IServerConfig;

  private server: http.Server;

  private logger: Logger;

  public static bootstrap(
    serverConfig: IServerConfig,
    router: Router,
    RpcServer?: JaysonServer,
    isSocket = false
  ): Server {
    return new Server(serverConfig, router, RpcServer, isSocket);
  }

  private constructor(
    serverConfig: IServerConfig,
    router: Router,
    RpcServer?: JaysonServer,
    isSocket = false
  ) {
    this.app = express();
    this.app.use(compression())
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
        `Server running in ${config.server.nodeEnv} environment on port ${this.serverConfig.server.port}`
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
          `RPC server running on port ${this.serverConfig.rpc?.port}`
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
    this.app.use(json({ limit: "500mb" }));
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(mongoSanitize({ allowDots: true }));
  }

  private initializeErrorHandler() {
    this.app.use(errorCatcherMiddleware(this.log));
  }

  public log = (
    severity: string,
    description: string,
    user?: string,
    more?: object
  ) => {
    this.logger.log({
      user,
      level: severity,
      message: description,
      ...more,
    });
  };
}
