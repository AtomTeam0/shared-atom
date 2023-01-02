import * as mongoose from "mongoose";
import { IMedia } from "../common/interfaces/media.interface";
import { config } from "../config";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";

const MediaSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: false,
    },
    audio: {
      type: String,
      required: false,
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
MediaSchema.plugin(blobPlugin<IMedia>, config.multer.propertyConfigs.media);

export const MediaModel = mongoose.model<IMedia & mongoose.Document>(
  "media",
  MediaSchema
);
