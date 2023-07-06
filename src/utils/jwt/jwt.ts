import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';
import { config } from '../../config';
import { Global } from 'common-atom/enums/helpers/Global';
import { setContext } from '../helpers/context';
import { wrapAsyncMiddleware } from '../helpers/wrapper';
import { InvalidToken, TokenNotProvided } from '../errors/validationError';
import clickConfig from '../jwt/clickConfig';

// Configure the Azure AD bearer strategy
const azureADBearerStrategy = new BearerStrategy(
    {
        identityMetadata: `https://${clickConfig.metadata.authority}/${clickConfig.credentials.tenantID}/${clickConfig.metadata.version}/${clickConfig.metadata.discovery}`,
        clientID: clickConfig.credentials.clientID,
        validateIssuer: clickConfig.settings.validateIssuer,
        loggingLevel: clickConfig.settings.loggingLevel,
        passReqToCallback: false,
    },
    (token: any, done: any) => {
        try {
            if (!token) {
                throw new TokenNotProvided();
            }

            // You can add custom validation logic here if needed

            return done(null, token);
        } catch (error) {
            console.log('Error validating access token:', error);
            return done(new InvalidToken('Invalid access token'));
        }
    }
);

// Configure Passport to use the Azure AD bearer strategy
passport.use(azureADBearerStrategy);

export const verifyToken = wrapAsyncMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('oauth-bearer', { session: false }, (err: Error, token: Express.User | undefined) => {
            if (err) {
                console.log('Error validating access token:', err);
                throw new InvalidToken('Invalid access token');
            }

            if (!token) {
                throw new TokenNotProvided();
            }

            req.user = token;
            setContext(Global.AZURE_USER, req.user);
            next();
        })(req, res, next);
    }
);
