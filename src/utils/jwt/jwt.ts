import { Request, Response, NextFunction } from "express";
import { AuthenticationResult, ConfidentialClientApplication, AccountInfo } from "@azure/msal-node";
import { Global } from "common-atom/enums/helpers/Global";
import { config } from "../../config";
import { InvalidToken, TokenNotProvided } from "../errors/validationError";
import { setContext } from "../helpers/context";
import { wrapAsyncMiddleware } from "../helpers/wrapper";
import clickConfig from "./clickConfig";
const options = {
  identityMetadata: `https://${clickConfig.metadata.authority}/${clickConfig.credentials.tenantID}/${clickConfig.metadata.version}/${clickConfig.metadata.discovery}`,
  issuer: `https://${clickConfig.metadata.authority}/${clickConfig.credentials.tenantID}/${clickConfig.metadata.version}`,
  clientID: clickConfig.credentials.clientID,
  audience: clickConfig.credentials.clientID,
  validateIssuer: clickConfig.settings.validateIssuer,
  loggingNoPII: true, // great for Debugging
  scope: clickConfig.metadata.scope,
  loggingLevel: clickConfig.settings.loggingLevel,
};
// Configure the MSAL application
const msalConfig = {
  auth: {
    clientId: options.clientID,
    authority: `https://${clickConfig.metadata.authority}/${clickConfig.credentials.tenantID}`,
    clientSecret: config.jwt.secretKey,
  },
};

const msalApp = new ConfidentialClientApplication(msalConfig);

export const verifyToken = wrapAsyncMiddleware(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new TokenNotProvided();
    }

    const token = authHeader.split(" ")[1];
    const result: AuthenticationResult | null = await msalApp
      .acquireTokenOnBehalfOf({
        scopes: clickConfig.metadata.scope, // Replace with your API's client ID
        oboAssertion: token,
      })
      .catch((error: any) => {
        console.log('error on aquireTokenOnBehalf:', error);
        throw new InvalidToken('Error in aquireTokenOnBehalf');
      });
    if (result && result.account) {
      req.user = result.account;
      setContext(Global.AZURE_USER, req.user);
    }
    next();
  }
);