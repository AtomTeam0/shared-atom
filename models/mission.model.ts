/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { WatchMode } from "../common/enums/WatchMode";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { UserModel } from "./user.model";
import { ItemModel } from "./item.model";
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
      type: mongoose.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    editor: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    item: {
      type: mongoose.Types.ObjectId,
      ref: ItemModel,
      required: true,
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
