import * as mongoose from "mongoose";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { IDocument } from "common-atom/interfaces/document.interface";

const DocumentSchema: mongoose.Schema = new mongoose.Schema(
  {
    chapters: {
      type: [mongoose.Types.ObjectId],
      ref: "chapters",
    },
    pdf: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  },
);

// plugins
DocumentSchema.plugin(populatePlugin<IDocument>, [
  { property: "chapters", ref: "chapters", isArray: true },
]);

export const DocumentModel = mongoose.model<IDocument & mongoose.Document>(
  "documents",
  DocumentSchema,
);
