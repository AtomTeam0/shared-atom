import * as mongoose from "mongoose";
import { IPakal } from "../common/interfaces/pakal.interface";
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
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
PakalSchema.plugin(populatePlugin<IPakal>, [
  { property: "chapters", ref: "chapters", isArray: true },
  { property: "test", ref: "tests" },
]);

export const PakalModel = mongoose.model<IPakal & mongoose.Document>(
  "pakals",
  PakalSchema
);
