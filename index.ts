import * as mongoose from "mongoose";
import { Router } from "express";
import * as jayson from "jayson/promise";
import { Server } from "./server";
import { IServerConfig } from "./common/interfaces/helpers/serverConfig.interface";
import { virtualsPlugin } from "./utils/schema/plugins/virtualsPlugin";

export const initApp = (
  nodeProcess: any,
  config: IServerConfig,
  AppRouter: Router,
  RPCServer?: jayson.Server,
  onClose?: () => void
) => {
  nodeProcess.on("uncaughtException", (err: Error) => {
    console.error("Unhandled Exception", err.stack);
    nodeProcess.exit(1);
  });

  nodeProcess.on("unhandledRejection", (err: Error) => {
    console.error("Unhandled Rejection", err);
    nodeProcess.exit(1);
  });

  nodeProcess.on("SIGINT", async () => {
    try {
      console.log("User Termination");
      await mongoose.disconnect();
      nodeProcess.exit(0);
    } catch (error) {
      console.error("Faild to close connections", error);
    }
  });
  (async () => {
    mongoose.plugin(virtualsPlugin);
    await mongoose.connect(config.db.connectionString, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log(`[MongoDB] connected to port ${config.db.port}`);
    console.log("Starting server");
    const server: Server = Server.bootstrap(config, AppRouter, RPCServer);

    server.app.on("close", () => {
      mongoose.disconnect();
      if (onClose) {
        onClose();
      }
      console.log("Server closed");
    });
  })();
};
