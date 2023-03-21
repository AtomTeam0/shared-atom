import * as mongoose from "mongoose";
import { Permission } from "../common/enums/Permission";
import { WatchMode } from "../common/enums/WatchMode";
import { IUser } from "../common/interfaces/user.interface";
import { indexPlugin } from "../utils/schema/plugins/indexPlugin";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { AreaModel } from "./area.model";
import { ChapterModel } from "./chapter.model";
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
      ref: "items",
      default: [],
    },
    lastWatched: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: "items",
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
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// plugins
UserSchema.plugin(populatePlugin<IUser>, [
  { property: "area", ref: "areas" },
  { property: "favorites", ref: "items", isArray: true },
  { property: "lastWatched", ref: "items", isArray: true },
  { property: "employees", ref: "users", isArray: true },
]);
UserSchema.plugin(indexPlugin<IUser>, {
  properties: ["_id", "firstName", "lastName"],
});

export const UserModel = mongoose.model<IUser & mongoose.Document>(
  "users",
  UserSchema
);
