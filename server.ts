import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";
import * as cors from "cors";
import * as winston from "winston";
import { NextFunction, Router } from "express";
import * as jayson from "jayson/promise";
import session from "express-session";
import helmet from "helmet";
import { IBearerStrategyOptionWithRequest } from "passport-azure-ad/bearer-strategy";
import passport from "passport";
import {
  ITokenPayload,
  VerifyCallback,
  BearerStrategy as OIDCBearerStrategy,
} from "passport-azure-ad";
import {
  userErrorHandler,
  serverErrorHandler,
  unknownErrorHandler,
} from "./utils/errors/errorHandler";
import { initLogger } from "./utils/helpers/logger";
import { IServerConfig } from "./common/interfaces/helpers/serverConfig.interface";
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

    this.app.use(
      session({
        secret: "kodkod",
        resave: false,
        saveUninitialized: true,
      })
    );

    this.app.use(helmet());

    // CLICK AUTHORIZE
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const options: IBearerStrategyOptionWithRequest = {
      identityMetadata: `https://login.microsoftonline.com/${config.azure.tenantID}/v2.0/.well-known/openid-configuration`,
      clientID: config.azure.clientID!,
      audience: config.azure.audience,
      issuer: config.azure.issuer,
      scope: [config.azure.scope!],
    };

    this.app.use(passport.initialize()); // Starts passport
    this.app.use(passport.session()); // Provides session support

    const bearerStrategy = new OIDCBearerStrategy(
      options,
      async (token: ITokenPayload, done: VerifyCallback) => {
        if (!token.upn) {
          done(new Error("upn is not found in token"));
        } else {
          const userid = token.upn.split("@")[0];
          console.log(userid);
          try {
            // const user = await getUser(userid);
            // if (user.length == 0) {
            //   throw new Error(`user not found ${userid}`)
            // } else {
            // addLog(`[Backend][authenticating][Success][${userid}] Successfully found user's data in DB.`, true);
            done(null, userid, token);
            // }
          } catch (err) {
            // addLog(`[Backend][authenticating][Error] Error in authentication: ${err.message || err}`, true);
            if (err?.toString().includes("user not found"))
              done("user not found");
            else done(new Error("unexpected error"));
          }
        }
      }
    );

    passport.use(bearerStrategy);

    const authenticateUser = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      passport.authenticate(
        "oauth-bearer",
        (err: any, user: any, info: any) => {
          if (!user) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res.status(401).json({ message: err || info }); // info contains the error message
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            req.user = user;
            next();
          }
        }
      )(req, res, next);
    };

    this.app.use(async (req, res, next) => {
      try {
        // const isBypassHeader = (req.headers[backendHeaderBypass] || "{}");

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        authenticateUser(req, res, next);
        // passport.authenticate('oauth-bearer', { session: false })(req, res, next);
      } catch (err) {
        // addLog(`[Backend][bypass][Error][${bypassID}] Error getting user data of ${bypassID}.`, true);
        // addLog(`[Backend][bypass][Error][${bypassID}] ${err}`, true);

        res.status(401).end();
      }
    });
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
