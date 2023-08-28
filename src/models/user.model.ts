import * as mongoose from "mongoose";
import { Permission } from "common-atom/enums/Permission";
import { WatchMode } from "common-atom/enums/WatchMode";
import { IUser } from "common-atom/interfaces/user.interface";
import { indexPlugin } from "../utils/schema/plugins/indexPlugin";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { aggregatePlugin } from "../utils/schema/plugins/aggregatePlugin";

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    permission: {
      type: String,
      required: true,
      default: Permission.VIEWER,
    },
    area: {
      type: String,
      required: true,
      ref: "areas",
    },
    favorites: {
      type: [String],
      required: true,
      ref: "items",
      default: [],
    },
    lastWatched: {
      type: [String],
      required: true,
      ref: "items",
      items: { uniqueItems: true },
      default: [],
    },
    employees: {
      type: [String],
      ref: "users",
    },
    chapters: {
      type: [
        {
          chapterId: {
            type: String,
            required: true,
            ref: "chapters",
          },
          mode: {
            type: WatchMode,
            required: true,
            default: WatchMode.UNREAD,
          },
        },
      ],
      _id: false,
      required: true,
      default: [],
    },
    media: {
      type: [
        {
          mediaId: {
            type: String,
            required: true,
            ref: "media",
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
      ],
      _id: false,
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
  { property: "employees", ref: "users", isArray: true, isTazId: true },
]);
UserSchema.plugin(indexPlugin<IUser>, {
  properties: ["_id", "name"],
});
UserSchema.plugin(aggregatePlugin);
export const UserModel = mongoose.model<IUser & mongoose.Document>(
  "users",
  UserSchema
);
