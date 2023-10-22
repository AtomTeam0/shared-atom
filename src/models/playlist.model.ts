import * as mongoose from "mongoose";
import { IPlaylist } from "common-atom/interfaces/playlist.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { config } from "../config";
import { aggregatePlugin } from "../utils/schema/plugins/aggregatePlugin";

const PlayListSchema: mongoose.Schema = new mongoose.Schema(
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
    thumbNail: {
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
PlayListSchema.plugin(populatePlugin<IPlaylist>, [
  { property: "subjects", ref: "subjects", isArray: true },
]);
PlayListSchema.plugin(aggregatePlugin);

export const PlaylistModel = mongoose.model<IPlaylist & mongoose.Document>(
  "playlists",
  PlayListSchema
);
