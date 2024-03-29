import * as mongoose from "mongoose";
import { WatchMode } from "common-atom/enums/WatchMode";
import { IMission } from "common-atom/interfaces/mission.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { aggregatePlugin } from "../utils/schema/plugins/aggregatePlugin";

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
  { property: "director", ref: "users", isTazId: true },
  { property: "editor", ref: "users", isTazId: true },
  { property: "item", ref: "items" },
]);

MissionSchema.plugin(aggregatePlugin);

export const MissionModel = mongoose.model<IMission & mongoose.Document>(
  "missions",
  MissionSchema
);
