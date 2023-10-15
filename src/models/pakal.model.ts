import * as mongoose from "mongoose";
import { IPakal } from "common-atom/interfaces/pakal.interface";
import { config } from "../config";
import { filePlugin } from "../utils/schema/plugins/filePlugin";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";

const PakalSchema: mongoose.Schema = new mongoose.Schema(
  {
    chapters: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: "chapters",
    },
    pdf: {
      type: String,
      required: true,
    },
    test: {
      type: mongoose.Types.ObjectId,
      ref: "tests",
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

PakalSchema.plugin(
  filePlugin<IPakal>,
  config.formidable.propertyConfigs.lesson
);

export const PakalModel = mongoose.model<IPakal & mongoose.Document>(
  "pakals",
  PakalSchema
);