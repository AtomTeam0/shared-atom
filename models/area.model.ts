/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { AreaNames } from "../enums/AreaNames";
import { FileTypes } from "../enums/helpers/FileTypes";
import { IArea } from "../interfaces/area.interface";
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
    capped: { max: Object.values(AreaNames).length, autoIndexId: true },
  }
);

// plugins
AreaSchema.plugin(blobPlugin, [
  {
    propertyName: "image",
    fileType: FileTypes.IMAGE,
  },
]);

export const AreaModel = mongoose.model<IArea & mongoose.Document>(
  "areas",
  AreaSchema
);
