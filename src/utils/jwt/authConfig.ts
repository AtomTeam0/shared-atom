const authConfig = {
    credentials: {
        tenantID: process.env.AZURE_TENANT_ID || '78820852-55fa-450b-908d-45c0d911e76b',
        clientID: process.env.AZURE_CLIENT_ID || 'ecb025c6-58d1-4593-b47b-a2a1d7ac661d',
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
        loggingLevel: "info" as const,
        loggingNoPII: false,
    },
}

export default authConfig