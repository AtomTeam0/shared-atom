import * as mongoose from "mongoose";
import { IVideo } from "common-atom/interfaces/video.interface";

const VideoSchema: mongoose.Schema = new mongoose.Schema(
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

export const VideoModel = mongoose.model<IVideo & mongoose.Document>(
  "videos",
  VideoSchema,
);
