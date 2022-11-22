/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { WatchMode } from "../enums/WatchMode";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { UserModel } from "./user.model";
import { ItemModel } from "./item.model";
import { IMission } from "../interfaces/mission.interface";

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
    toJSON: {
      virtuals: true,
      transform(_doc: any, ret: any): void {
        // eslint-disable-next-line no-param-reassign
        delete ret._id;
      },
    },

    versionKey: false,
    id: true,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
MissionSchema.plugin(populatePlugin, [
  { path: "director", ref: "users" },
  { path: "editor", ref: "users" },
  { path: "item", ref: "items" },
]);

export const MissionModel = mongoose.model<IMission & mongoose.Document>(
  "missions",
  MissionSchema
);
