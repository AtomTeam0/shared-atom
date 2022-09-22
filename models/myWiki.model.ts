import * as mongoose from "mongoose";
import { IMyWiki } from "../interfaces/myWiki.interface";

const mongooseFuzzySearching = require("mongoose-fuzzy-searching");

const MyWikiSchema: mongoose.Schema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
    },
    defenition: {
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

MyWikiSchema.plugin(mongooseFuzzySearching, {
  fields: ["word", "description"],
});

export const MyWikiModel = mongoose.model<IMyWiki & mongoose.Document>(
  "myWiki",
  MyWikiSchema
);
