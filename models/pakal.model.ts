import * as mongoose from "mongoose";
import { IPakal } from "../interfaces/pakal.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { ChapterModel } from "./chapter.model";
import { TestModel } from "./test.model";

const PakalSchema: mongoose.Schema = new mongoose.Schema(
  {
    chapters: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: ChapterModel,
    },
    pdfURL: {
      type: String,
      required: true,
    },
    test: {
      type: mongoose.Types.ObjectId,
      ref: TestModel,
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
PakalSchema.plugin(populatePlugin, [
  { path: "chapters", ref: "chapters" },
  { path: "test", ref: "tests" },
]);

export const PakalModel = mongoose.model<IPakal & mongoose.Document>(
  "pakals",
  PakalSchema
);
