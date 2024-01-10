import { IItem } from "common-atom/interfaces/item.interface";
import * as mongoose from "mongoose";
import { aggregatePlugin } from "../utils/schema/plugins/aggregatePlugin";
import { indexPlugin } from "../utils/schema/plugins/indexPlugin";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { Status } from "common-atom/enums/Status";
import { ContentType } from "common-atom/enums/ContentType";

const ItemSchema = new mongoose.Schema(
  {
    updatedAt: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    priority: {
      type: Number,
      required: true,
      validate: {
        validator: (val: number) => val <= 100 && val >= 1,
        message: `priority out of range (1-100)`,
      },
    },
    timeToRead: {
      type: Number,
      required: true,
      default: 5,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    contentType: {
      type: String,
      enum: ContentType,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Status,
    },
    thumbNail: {
      type: String,
      required: true,
    },
    unit: {
      type: mongoose.Types.ObjectId,
      ref: "units",
      required: true,
    },
    filters: {
      type: [mongoose.Types.ObjectId],
      ref: "filters",
      required: true,
    },
    world: {
      type: mongoose.Types.ObjectId,
      ref: "worlds",
      required: true,
    },
    contentId: {
      type: String,
      required: true,
    },
    editedBy: {
      type: String,
      required: true,
      ref: "users",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  },
);

// plugins
ItemSchema.plugin(populatePlugin<IItem>, [
  { property: "unit", ref: "units" },
  { property: "world", ref: "worlds" },
  { property: "filters", ref: "filters", isArray: true },
]);
ItemSchema.plugin(indexPlugin<IItem>, {
  properties: ["title"],
});
ItemSchema.plugin(aggregatePlugin);
export const ItemModel = mongoose.model<IItem & mongoose.Document>(
  "items",
  ItemSchema,
);
