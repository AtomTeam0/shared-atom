import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { BearerStrategy, ITokenPayload } from 'passport-azure-ad';
import { config } from '../../config';
import { Global } from 'common-atom/enums/helpers/Global';
import { setContext } from '../helpers/context';
import { wrapAsyncMiddleware } from '../helpers/wrapper';
import { InvalidToken, TokenNotProvided } from '../errors/validationError';
import authConfig from './authConfig';

// Configure the Azure AD bearer strategy
const azureADBearerStrategy = new BearerStrategy(
    {
        identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
        // issuer: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}`,
        clientID: authConfig.credentials.clientID,
        scope: authConfig.metadata.scope as string[],
        // audience: authConfig.credentials.clientID, // audience is this application
        validateIssuer: authConfig.settings.validateIssuer,
        passReqToCallback: authConfig.settings.passReqToCallback,
        loggingLevel: authConfig.settings.loggingLevel,
        loggingNoPII: authConfig.settings.loggingNoPII,
    },
    (req, token, done) => {
        try {
            console.log('req', req)
            console.log('token', token)
            /**
     * Access tokens that have neither the 'scp' (for delegated permissions) nor
     * 'roles' (for application permissions) claim are not to be honored.
     */
            if (!token.hasOwnProperty('scp') && !token.hasOwnProperty('roles')) {
                return done(new InvalidToken('Unauthorized - No delegated or app permission claims found [roles,scp]'), null, "No delegated or app permission claims found");
            }
            if (!token) {
                throw new TokenNotProvided();
            }

            // You can add custom validation logic here if needed

            return done(null, {}, token);
        } catch (error) {
            console.log('Error validating access token:', error);
            return done(new InvalidToken('Invalid access token'));
        }
    }
);

// Configure Passport to use the Azure AD bearer strategy
passport.use('oauth-bearer', azureADBearerStrategy);

// configure a middleware to be used in the routes
export const verifyToken = wrapAsyncMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('oauth-bearer', { session: false }, (err: Error, user: any, tokenPayload: ITokenPayload) => {
            console.log('im here error = ', err)
            console.log('im here user = ', user)
            console.log('im here tokenPayload = ', tokenPayload)
            if (err) {
                console.log('Error validating access token:', err.message);
                throw new InvalidToken(`Invalid access token  [${err.message}]`);
            }

            if (!tokenPayload) {
                throw new TokenNotProvided();
            }
            req.user = tokenPayload;
            setContext(Global.AZURE_USER, req.user);
            next();
        })(req, res, next);
    }
);
