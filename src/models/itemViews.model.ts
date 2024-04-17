import {Schema, Types, Document, model} from "mongoose";
import { ItemViews } from "common-atom/interfaces/itemViews.type";

const itemViewsSchema: Schema<ItemViews> = new Schema(
  {
    itemId: {
      type: Types.ObjectId,
      ref: "items",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "timeViewed", updatedAt: false },
  }
);

export const ItemViewsModel = model<ItemViews & Document>(
  "itemViews",
  itemViewsSchema
);
