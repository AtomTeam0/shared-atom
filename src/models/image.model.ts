import * as mongoose from "mongoose";
import { IImage } from "common-atom/interfaces/image.interface";

const ImageSchema: mongoose.Schema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  },
);

export const ImageModel = mongoose.model<IImage & mongoose.Document>(
  "images",
  ImageSchema,
);
