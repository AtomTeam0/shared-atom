import {Schema, Document, model} from "mongoose";
import { IAudio } from "common-atom/interfaces/audio.interface";

const AudioSchema: Schema = new Schema(
  {
    audio: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  },
);

export const AudioModel = model<IAudio & Document>(
  "audios",
  AudioSchema,
);
