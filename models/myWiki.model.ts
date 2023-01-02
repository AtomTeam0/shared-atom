import * as mongoose from "mongoose";
import { IMyWiki } from "../common/interfaces/myWiki.interface";
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
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
MyWikiSchema.plugin(indexPlugin<IMyWiki>, {
  properties: ["word", "defenition"],
});

export const MyWikiModel = mongoose.model<IMyWiki & mongoose.Document>(
  "myWiki",
  MyWikiSchema
);
