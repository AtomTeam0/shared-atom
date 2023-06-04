import * as mongoose from "mongoose";
import { IPlaylist } from "common-atom/interfaces/playlist.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";
import { config } from "../config";

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
    isActice: {
      type: Boolean,
      required: true,
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

// plugins
playListSchema.plugin(populatePlugin<IPlaylist>, [
  { property: "subjects", ref: "subjects", isArray: true },
]);
playListSchema.plugin(
  blobPlugin<IPlaylist>,
  config.formidable.propertyConfigs.playlist
);

export const BookModel = mongoose.model<IPlaylist & mongoose.Document>(
  "playlists",
  playListSchema
);
