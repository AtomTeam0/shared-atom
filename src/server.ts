import express from "express";
import http from "http";
import { urlencoded, json } from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
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
import { serve, setup } from "swagger-ui-express";

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

    const swaggerSettings = {
      swaggerDefinition: {
        restapi: '3.0.0',
        info: {
          title: 'MyNet API',
          version: '1.0.0',
          description: 'Mynet is an awesome app developed by Dawn unit to share information from each unit directly to the users',
        },
        servers: [
          {
            url: 'http://localhost:3000',
          },
          {
            url: 'http://localhost:3000/nest',
          },
        ],
      },
      apis: ['*/Backend/**/router.ts'],
    }
    this.app.use('/docs', serve, setup(swaggerSettings));

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
    this.app.use(json({ limit: "500mb" }));
    this.app.use(urlencoded({ extended: true }));
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
