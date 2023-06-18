import * as mongoose from "mongoose";
import { PorpertyOptionalDeep, propertyValGetter } from "../../helpers/types";
import { Plugins, genericPostMiddleware } from "../helpers/pluginHelpers";
import { creationFunctionType } from "../helpers/schemaHelpers";
import { emitEvent } from "../helpers/socketHelpers";

export function socketPlugin<T>(
  schema: mongoose.Schema,
  options: {
    eventName: string;
    roomNameProperty?: PorpertyOptionalDeep<T>;
  }
) {
  genericPostMiddleware(
    schema,
    creationFunctionType,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    async (thisObject: any, _res: any) => {
      if (options.roomNameProperty) {
        emitEvent(
          options.eventName,
          thisObject,
          propertyValGetter<T>(thisObject, options.roomNameProperty)
        );
      } else {
        emitEvent(options.eventName, thisObject);
      }
    },
    Plugins.SOCKET
  );
}
