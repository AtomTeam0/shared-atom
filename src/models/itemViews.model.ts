import mongoose from "mongoose";

const itemViewsSchema: mongoose.Schema = new mongoose.Schema(
  {
     
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const ItemViewsModel = mongoose.model<mongoose.Document>(
  "itemViews",
  itemViewsSchema
);
