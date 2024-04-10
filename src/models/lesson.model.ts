import {Schema, Types, Document, model} from "mongoose";
import { ILesson } from "common-atom/interfaces/lesson.interface";
import { config } from "../config";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";

const LessonSchema: Schema = new Schema(
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
      type: [Types.ObjectId],
      required: true,
      ref: "chapters",
    },
    preKnowledge: {
      type: [Types.ObjectId],
      required: true,
      ref: "items",
      default: [],
    },
    test: {
      type: Types.ObjectId,
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

export const LessonModel = model<ILesson & Document>(
  "lessons",
  LessonSchema
);
