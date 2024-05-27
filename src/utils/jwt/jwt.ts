import { Global } from "common-atom/enums/helpers/Global";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { BearerStrategy, ITokenPayload } from "passport-azure-ad";
import {
  generateUnauthorizedError,
  throwUnauthorizedError,
} from "../errors/applicationError";
import { TokenNotProvided } from "../errors/validationError";
import { setContext } from "../helpers/context";
import { wrapAsyncMiddleware } from "../helpers/wrapper";
import authConfig from "./authConfig";

// Configure the Azure AD bearer strategy
const azureADBearerStrategy = new BearerStrategy(
  {
    identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
    clientID: authConfig.credentials.clientID,
    scope: authConfig.metadata.scope as string[],
    validateIssuer: authConfig.settings.validateIssuer,
    passReqToCallback: authConfig.settings.passReqToCallback,
    loggingLevel: authConfig.settings.loggingLevel,
    loggingNoPII: authConfig.settings.loggingNoPII,
  },
  (req, token, done) => {
    try {
      /**
       * Access tokens that have neither the 'scp' (for delegated permissions) nor
       * 'roles' (for application permissions) claim are not to be honored.
       */
      if (!token.hasOwnProperty("scp") && !token.hasOwnProperty("roles")) {
        return done(
          generateUnauthorizedError(
            "Unauthorized - No delegated or app permission claims found [roles,scp]"
          ),

          null,
          "No delegated or app permission claims found"
        );
      }
      if (!token) {
        throw new TokenNotProvided();
      }

      return done(null, {}, token);
    } catch (error) {
      console.log("Error validating access token:", error);
      return done(generateUnauthorizedError("Invalid access token"));
    }
  }
);

passport.use("oauth-bearer", azureADBearerStrategy);

export const verifyToken = wrapAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "oauth-bearer",
      { session: false },
      (err: Error, user: any, tokenPayload: ITokenPayload) => {
        if (err) {
          console.log("Error validating access token:", err.message);
          throwUnauthorizedError(`Invalid access token  [${err.message}]`);
        }

        if (!tokenPayload) {
          throw new TokenNotProvided();
        }
        req.user = tokenPayload;
        setContext(Global.AZURE_USER, req.user);
        next();
      }
    )(req, res, next);
  }
);
