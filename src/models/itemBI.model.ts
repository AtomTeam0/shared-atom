import mongoose from "mongoose";

const itemBISchema: mongoose.Schema = new mongoose.Schema(
  {},
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const ItemBIModel = mongoose.model<mongoose.Document>(
  "itemBI",
  itemBISchema
);
