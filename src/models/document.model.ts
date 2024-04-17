import {Schema, Types, Document, model} from "mongoose";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { IDocument } from "common-atom/interfaces/document.interface";

const DocumentSchema: Schema = new Schema(
  {
    chapters: {
      type: [Types.ObjectId],
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

export const DocumentModel = model<IDocument & Document>(
  "documents",
  DocumentSchema,
);
