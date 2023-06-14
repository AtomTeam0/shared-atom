export default {
    credentials: {
        tenantID: process.env.AZURE_TENANT_ID || '78820852-55fa-450b-908d-45c0d911e76b',
        clientID: process.env.AZURE_CLIENT_ID || 'e30bf5ec-935e-42d4-ba35-6198530f2769',
    },
    metadata: {
        authority: 'login.microsoftonline.com',
        discovery: '.well-known/openid-configuration',
        version: 'v2.0',
        scope: [process.env.AUTH_SCOPE ?? 'https://mynet.dev.digital.idf.il/login'],
    },
    settings: {
        validateIssuer: true,
        passReqToCallback: false,
        loggingLevel: 'info' as const,
    },
};