import { IMyWiki } from "common-atom/interfaces/myWiki.interface";
import * as mongoose from "mongoose";
import { aggregatePlugin } from "../utils/schema/plugins/aggregatePlugin";
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
    isByViewer: {
      type: Boolean,
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
MyWikiSchema.plugin(aggregatePlugin);
export const MyWikiModel = mongoose.model<IMyWiki & mongoose.Document>(
  "myWiki",
  MyWikiSchema
);
