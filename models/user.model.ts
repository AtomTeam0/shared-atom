import * as mongoose from "mongoose";
import { Permission } from "../enums/Permission";
import { WatchMode } from "../enums/WatchMode";
import { IUser } from "../interfaces/user.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { AreaModel } from "./area.model";
import { ChapterModel } from "./chapter.model";
import { ItemModel } from "./item.model";
import { MediaModel } from "./media.model";

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    personalId: {
      type: String,
      required: true,
    },
    permission: {
      type: String,
      required: true,
      default: Permission.VIEWER,
    },
    area: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: AreaModel,
    },
    favorites: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: ItemModel,
      default: [],
    },
    lastWatched: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: ItemModel,
      items: { uniqueItems: true },
      default: [],
    },
    employees: {
      type: [mongoose.Types.ObjectId],
      ref: "users",
    },
    chapters: {
      type: {
        chapterId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: ChapterModel,
        },
        mode: {
          type: WatchMode,
          required: true,
          default: WatchMode.UNREAD,
        },
      },
      required: true,
      default: [],
    },
    media: {
      type: {
        mediaId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: MediaModel,
        },
        mode: {
          type: WatchMode,
          required: true,
          default: WatchMode.UNREAD,
        },
        note: {
          type: String,
          required: false,
        },
      },
      required: true,
      default: [],
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
UserSchema.plugin(populatePlugin, [
  { path: "area", ref: "areas" },
  { path: "favorites", ref: "items" },
  { path: "lastWatched", ref: "items" },
  { path: "employees", ref: "users" },
]);

export const UserModel = mongoose.model<IUser & mongoose.Document>(
  "users",
  UserSchema
);
