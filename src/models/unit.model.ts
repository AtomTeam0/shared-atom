import {Schema, Types, Document, model} from "mongoose";
import { IUnit } from "common-atom/interfaces/unit.interface";
import { config } from "../config";

const UnitSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const UnitModel = model<IUnit & Document>(
  "units",
  UnitSchema
);
