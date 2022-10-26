/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { WatchMode } from "../enums/WatchMode";
import { IItem } from "../interfaces/item.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { UserModel } from "./user.model";
import { ItemModel } from "./item.model";

const MissionSchema: mongoose.Schema = new mongoose.Schema(
  {
    notes: {
      type: String,
    },
    complitionDate: {
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
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// plugins
MissionSchema.plugin(populatePlugin, [
  { path: "director", ref: "users" },
  { path: "editor", ref: "users" },
  { path: "item", ref: "items" },
]);

export const MissionModel = mongoose.model<IItem & mongoose.Document>(
  "missions",
  MissionSchema
);
