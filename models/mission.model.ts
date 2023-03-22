import * as mongoose from "mongoose";
import { WatchMode } from "../common/enums/WatchMode";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { IMission } from "../common/interfaces/mission.interface";

const MissionSchema: mongoose.Schema = new mongoose.Schema(
  {
    notes: {
      type: String,
    },
    complitionDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: WatchMode.UNREAD,
    },
    director: {
      type: String,
      required: true,
      ref: "users",
    },
    editor: {
      type: String,
      required: true,
      ref: "users",
    },
    item: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "items",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
MissionSchema.plugin(populatePlugin<IMission>, [
  { property: "director", ref: "users" },
  { property: "editor", ref: "users" },
  { property: "item", ref: "items" },
]);

export const MissionModel = mongoose.model<IMission & mongoose.Document>(
  "missions",
  MissionSchema
);
