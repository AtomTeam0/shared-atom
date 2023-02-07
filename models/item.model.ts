/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { IItem } from "../common/interfaces/item.interface";
import { config } from "../config";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";
import { indexPlugin } from "../utils/schema/plugins/indexPlugin";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { AreaModel } from "./area.model";
import { UnitModel } from "./unit.model";

const ItemSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    priority: {
      type: Number,
      required: true,
      default: 50,
      validate: {
        validator: (val: number) => val <= 100 && val >= 1,
        message: `priority out of range (1-100)`,
      },
    },
    timeToRead: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    isByMission: {
      type: Boolean,
      required: true,
      default: false,
    },
    sections: {
      type: [String],
    },
    categories: {
      type: [String],
    },
    corps: {
      type: [String],
    },
    grade: {
      type: String,
    },
    contentType: {
      type: String,
      required: true,
    },
    unit: {
      type: mongoose.Types.ObjectId,
      ref: UnitModel,
    },
    editedBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    areas: {
      type: [mongoose.Types.ObjectId],
      ref: AreaModel,
    },
    similarItems: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: "items",
      default: [],
    },
    thumbNail: {
      type: String,
    },
    contentId: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: true },
  }
);

// plugins
ItemSchema.plugin(populatePlugin<IItem>, [
  { property: "areas", ref: "areas", isArray: true },
  { property: "unit", ref: "units" },
  { property: "similarItems", ref: "items", isArray: true },
]);
ItemSchema.plugin(indexPlugin<IItem>, {
  properties: ["title"],
});
ItemSchema.plugin(blobPlugin<IItem>, config.formidable.propertyConfigs.item);

export const ItemModel = mongoose.model<IItem & mongoose.Document>(
  "items",
  ItemSchema
);
