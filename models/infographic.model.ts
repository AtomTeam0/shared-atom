import * as mongoose from "mongoose";
import { FileTypes } from "../common/enums/helpers/FileTypes";
import { IInfographic } from "../common/interfaces/infographic.interface";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";

const InfographicSchema: mongoose.Schema = new mongoose.Schema(
  {
    image: {
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
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
InfographicSchema.plugin(blobPlugin<IInfographic>, [
  {
    property: "image",
    fileType: FileTypes.IMAGE,
  },
]);

export const InfographicModel = mongoose.model<
  IInfographic & mongoose.Document
>("infographics", InfographicSchema);
