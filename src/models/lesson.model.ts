import * as mongoose from "mongoose";
import { ILesson } from "common-atom/interfaces/lesson.interface";
import { config } from "../config";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";

const LessonSchema: mongoose.Schema = new mongoose.Schema(
  {
    goal: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    pdf: {
      type: String,
      required: true,
    },
    chapters: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: "chapters",
    },
    preKnowledge: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: "items",
      default: [],
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
LessonSchema.plugin(populatePlugin<ILesson>, [
  { property: "chapters", ref: "chapters", isArray: true },
  { property: "preKnowledge", ref: "items", isArray: true },
  { property: "test", ref: "tests" },
]);

export const LessonModel = mongoose.model<ILesson & mongoose.Document>(
  "lessons",
  LessonSchema
);
