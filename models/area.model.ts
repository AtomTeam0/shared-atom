/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { AreaNames } from "../common/enums/AreaNames";
import { IArea } from "../common/interfaces/area.interface";
import { config } from "../config";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";

const AreaSchema: mongoose.Schema = new mongoose.Schema(
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
    polygon: {
      type: [[Number]],
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
    capped: { max: Object.values(AreaNames).length, autoIndexId: true },
  }
);

// plugins
AreaSchema.plugin(blobPlugin<IArea>, config.formidable.propertyConfigs.area);

export const AreaModel = mongoose.model<IArea & mongoose.Document>(
  "areas",
  AreaSchema
);
