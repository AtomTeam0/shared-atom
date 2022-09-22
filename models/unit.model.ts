/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { IUnit } from "../interfaces/unit.interface";

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

export const UnitModel = mongoose.model<IUnit & mongoose.Document>(
  "units",
  UnitSchema
);
