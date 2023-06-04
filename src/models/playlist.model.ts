import * as mongoose from "mongoose";
import { IPlaylist } from "common-atom/interfaces/playlist.interface";

const playListSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    pdf: {
      type: String,
      required: true,
    },
    subjects: {
      type: [mongoose.Types.ObjectId],
      ref: "books",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const BookModel = mongoose.model<IPlaylist & mongoose.Document>(
  "playlists",
  playListSchema
);
