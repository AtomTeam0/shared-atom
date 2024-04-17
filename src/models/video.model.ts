import {Schema, Types, Document, model} from "mongoose";
import { IVideo } from "common-atom/interfaces/video.interface";

const VideoSchema: Schema = new Schema(
  {
    video: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  },
);

export const VideoModel = model<IVideo & Document>(
  "videos",
  VideoSchema,
);
