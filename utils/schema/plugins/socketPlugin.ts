import * as mongoose from "mongoose";
import { preCreationFunctionType } from "../helpers/schemaHelpers";
import { emitEvent } from "../helpers/socketHelpers";

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
    async function (this: any, next: (err?: mongoose.CallbackError) => void) {
      if (options.roomNameProperty) {
        emitEvent(
          options.eventName,
          this,
          options.innerRoomNameProperty
            ? this[options.roomNameProperty][options.innerRoomNameProperty]
            : this[options.roomNameProperty]
        );
      } else {
        emitEvent(options.eventName, this);
      }
      next();
    }
  );
}
