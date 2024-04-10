import {Schema, Types, Document, model} from "mongoose";
import { IMedia } from "common-atom/interfaces/media.interface";
import { config } from "../config";

const MediaSchema: Schema = new Schema(
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
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const MediaModel = model<IMedia & Document>(
  "media",
  MediaSchema
);
