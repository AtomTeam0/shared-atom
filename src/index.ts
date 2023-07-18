import * as mongoose from "mongoose";
import * as jayson from "jayson/promise";
import { IServerConfig } from "common-atom/interfaces/helpers/serverConfig.interface";
import { Server } from "./server";
import { aggregatePlugin } from "./utils/schema/plugins/aggregatePlugin";

import "./models/area.model";

mongoose.plugin(aggregatePlugin);

// eslint-disable-next-line import/first, import/order
import { Router } from "express";

export const initApp = (
  nodeProcess: any,
  config: IServerConfig,
  AppRouter: Router,
  RPCServer?: jayson.Server,
  isSocket = false
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
    await mongoose.connect(config.db.connectionString, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log(`[MongoDB] connected to port ${config.db.port}`);
    console.log("Starting server");
    const server: Server = Server.bootstrap(
      config,
      AppRouter,
      RPCServer,
      isSocket
    );

    server.app.on("close", () => {
      mongoose.disconnect();
      console.log("Server closed");
    });
  })();
};
