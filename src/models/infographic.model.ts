import * as mongoose from "mongoose";
import { IInfographic } from "common-atom/interfaces/infographic.interface";
import { config } from "../config";

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

export const InfographicModel = mongoose.model<
  IInfographic & mongoose.Document
>("infographics", InfographicSchema);
