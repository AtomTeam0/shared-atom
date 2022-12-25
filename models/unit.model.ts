/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { IUnit } from "../common/interfaces/unit.interface";
import { config } from "../config";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";

const UnitSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(_doc: any, ret: any): void {
        // eslint-disable-next-line no-param-reassign
        delete ret._id;
      },
    },

    versionKey: false,
    id: true,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
UnitSchema.plugin(blobPlugin<IUnit>, config.multer.propertyConfigs.unit);

export const UnitModel = mongoose.model<IUnit & mongoose.Document>(
  "units",
  UnitSchema
);
