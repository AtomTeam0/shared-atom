import * as mongoose from "mongoose";
import { IUnit } from "common-atom/interfaces/unit.interface";
import { config } from "../config";

const UnitSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
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

export const UnitModel = mongoose.model<IUnit & mongoose.Document>(
  "units",
  UnitSchema
);
