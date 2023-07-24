const authConfig = {
    credentials: {
        tenantID: process.env.AZURE_TENANT_ID || '78820852-55fa-450b-908d-45c0d911e76b',
        clientID: process.env.AZURE_CLIENT_ID || 'e30bf5ec-935e-42d4-ba35-6198530f2769',
    },
    metadata: {
        authority: "login.microsoftonline.com",
        discovery: ".well-known/openid-configuration",
        version: "v2.0",
        scope: [process.env.AZURE_SCOPE] || ["Mynet.Access.API"]
    },
    settings: {
        validateIssuer: false,
        passReqToCallback: true,
        loggingLevel: process.env.LOGGING_LEVEL as ('info' | 'error' | 'warn' | undefined) || "info",
        loggingNoPII: process.env.LOGGING_NO_PII === 'true' || false,
    },
}

export default authConfig