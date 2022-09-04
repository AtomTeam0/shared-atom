export interface IServerConfig {
  db: {
    connectionString: string;
    port: number;
  };
  server: {
    name: string;
    port: number;
  };
  cors: {
    allowedOrigins: string[];
  };
  rpc?: {
    port: number;
  };
}
