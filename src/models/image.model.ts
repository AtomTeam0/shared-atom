import {Schema, Document, model} from "mongoose";
import { IImage } from "common-atom/interfaces/image.interface";

const ImageSchema: Schema = new Schema(
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

export const ImageModel = model<IImage & Document>(
  "images",
  ImageSchema,
);
