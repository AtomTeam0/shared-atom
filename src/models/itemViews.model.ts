import * as mongoose from "mongoose";
import { ItemViews } from "common-atom/interfaces/itemViews.type";

const itemViewsSchema: mongoose.Schema<ItemViews> = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Types.ObjectId,
      ref: "items",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "timeViewed", updatedAt: false },
  }
);

export const ItemViewsModel = mongoose.model<ItemViews & mongoose.Document>(
  "itemViews",
  itemViewsSchema
);
