import * as mongoose from "mongoose";
import { ILesson } from "../common/interfaces/lesson.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { ChapterModel } from "./chapter.model";
import { ItemModel } from "./item.model";
import { TestModel } from "./test.model";

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
    pdfURL: {
      type: String,
      required: true,
    },
    chapters: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: ChapterModel,
    },
    preKnowledge: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: ItemModel,
      default: [],
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
LessonSchema.plugin(populatePlugin<ILesson>, [
  { property: "chapters", ref: "chapters", isArray: true },
  { property: "preKnowledge", ref: "items", isArray: true },
  { property: "test", ref: "tests" },
]);

export const LessonModel = mongoose.model<ILesson & mongoose.Document>(
  "lessons",
  LessonSchema
);
