import { IMyWiki } from "common-atom/interfaces/myWiki.interface";
import {Schema, Document, model} from "mongoose";
import { aggregatePlugin } from "../utils/schema/plugins/aggregatePlugin";
import { indexPlugin } from "../utils/schema/plugins/indexPlugin";

const MyWikiSchema: Schema = new Schema(
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
    createdBy: {
      type: String,
    },
    approvedBy: {
      type: String,
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
export const MyWikiModel = model<IMyWiki & Document>(
  "myWiki",
  MyWikiSchema
);
