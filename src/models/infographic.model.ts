import * as mongoose from "mongoose";
import { IInfographic } from "common-atom/interfaces/infographic.interface";
import { config } from "../config";
import { filePlugin } from "../utils/schema/plugins/filePlugin";

const InfographicSchema: mongoose.Schema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
InfographicSchema.plugin(
  filePlugin<IInfographic>,
  config.formidable.propertyConfigs.infographic
);

export const InfographicModel = mongoose.model<
  IInfographic & mongoose.Document
>("infographics", InfographicSchema);
