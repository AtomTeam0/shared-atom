/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { config } from "../../microServices/item-compositor/src/config";
import { IItem } from "../../microServices/item-compositor/shared/interfaces/item.interface";
import { conditionPlugin } from "../../microServices/item-compositor/shared/utils/schema/plugins/conditionPlugin";
import { patchBooleanPlugin } from "../../microServices/item-compositor/shared/utils/schema/plugins/patchPlugin";
import { populatePlugin } from "../../microServices/item-compositor/shared/utils/schema/plugins/populatePlugin";
import { AreaModel } from "./area.model";
import { UnitModel } from "./unit.model";

// eslint-disable-next-line import/no-unresolved
const mongooseFuzzySearching = require("mongoose-fuzzy-searching");

const ItemSchema: mongoose.Schema = new mongoose.Schema(
  {
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
      default: Math.ceil(config.priority.maxPriority / 2),
      validate: {
        validator: (val: number) =>
          val <= config.priority.maxPriority &&
          val >= config.priority.minPriority,
        message: `priority out of range (${config.priority.minPriority}-${config.priority.maxPriority})`,
      },
    },
    timeToRead: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    areas: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: AreaModel,
    },
    sections: {
      type: [String],
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    corps: {
      type: [String],
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    unit: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: UnitModel,
    },
    similarItems: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: "items",
      default: [],
    },
    thumbNail: {
      type: String,
      required: true,
    },
    contentId: {
      type: String,
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
    timestamps: { createdAt: false, updatedAt: true },
  }
);

// plugins
ItemSchema.plugin(conditionPlugin, {
  propertyName: "isActive",
  wantedVal: true,
});
ItemSchema.plugin(populatePlugin, [
  { path: "areas", ref: "areas" },
  { path: "unit", ref: "units" },
  { path: "similarItems", ref: "items" },
]);
ItemSchema.plugin(patchBooleanPlugin, {
  foreignArrayProperty: "favorites",
  localBoolProperty: "isFavorite",
  defaultValue: false,
});
ItemSchema.plugin(mongooseFuzzySearching, { fields: ["title"] });

export const ItemModel = mongoose.model<IItem & mongoose.Document>(
  "items",
  ItemSchema
);
