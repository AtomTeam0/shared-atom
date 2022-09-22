import * as mongoose from "mongoose";
import { WatchMode } from "../enums/WatchMode";
import { IMedia } from "../interfaces/media.interface";
import { patchObjectPlugin } from "../utils/schema/plugins/patchPlugin";

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
    media: {
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
MediaSchema.plugin(patchObjectPlugin, {
  foreignArrayProperty: "media",
  foreignIdProperty: "mediaId",
  defaultValue: { mode: WatchMode.UNREAD },
});

export const MediaModel = mongoose.model<IMedia & mongoose.Document>(
  "media",
  MediaSchema
);
