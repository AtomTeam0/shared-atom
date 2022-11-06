import * as mongoose from "mongoose";
import { preCreationFunctionType } from "../helpers/schemaHelpers";
import { SocketServer } from "../helpers/socketHelpers";

export function socketPlugin(
  schema: mongoose.Schema,
  options: {
    eventName: string;
    roomNameProperty?: string;
    innerRoomNameProperty?: string;
  }
) {
  schema.post(
    preCreationFunctionType,
    async function (
      this: any,
      res: any[],
      next: (err?: mongoose.CallbackError) => void
    ) {
      if (options.roomNameProperty) {
        SocketServer.emitEvent(
          options.eventName,
          this,
          options.innerRoomNameProperty
            ? this[options.roomNameProperty][options.innerRoomNameProperty]
            : this[options.roomNameProperty]
        );
      } else {
        SocketServer.emitEvent(options.eventName, this);
      }
      next();
    }
  );
}
