import * as mongoose from "mongoose";
import { IAudio } from "common-atom/interfaces/audio.interface";

const AudioSchema: mongoose.Schema = new mongoose.Schema(
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

export const AudioModel = mongoose.model<IAudio & mongoose.Document>(
  "audios",
  AudioSchema,
);
