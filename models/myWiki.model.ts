import * as mongoose from "mongoose";
import { IMyWiki } from "../interfaces/myWiki.interface";
import { indexPlugin } from "../utils/schema/plugins/indexPlugin";

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

// plugins
MyWikiSchema.plugin(indexPlugin, {
  propertyNames: ["word", "defenition"],
});

export const MyWikiModel = mongoose.model<IMyWiki & mongoose.Document>(
  "myWiki",
  MyWikiSchema
);
