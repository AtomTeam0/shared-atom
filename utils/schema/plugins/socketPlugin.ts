import * as mongoose from "mongoose";
import { PorpertyOptionalDeep, propertyValGetter } from "../../helpers/types";
import { preCreationFunctionType } from "../helpers/schemaHelpers";
import { emitEvent } from "../helpers/socketHelpers";

export function socketPlugin<T>(
  schema: mongoose.Schema,
  options: {
    eventName: string;
    roomNameProperty?: PorpertyOptionalDeep<T>;
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
        emitEvent(
          options.eventName,
          this,
          propertyValGetter<T>(this, options.roomNameProperty)
        );
      } else {
        emitEvent(options.eventName, this);
      }
      next();
    }
  );
}
