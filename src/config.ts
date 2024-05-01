export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || "development",
    withDeepPlugin: (process.env.WITH_DEEP_PULGINS || "true") === "true",
  },
  jwt: {
    secretKey: process.env.SECRET_KEY || "atomTeam",
  },
};
