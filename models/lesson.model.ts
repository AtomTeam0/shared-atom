import * as mongoose from "mongoose";
import { ILesson } from "../../microServices/lesson-service/shared/interfaces/lesson.interface";
import { populatePlugin } from "../../microServices/lesson-service/shared/utils/schema/plugins/populatePlugin";
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
LessonSchema.plugin(populatePlugin, [
  { path: "chapters", ref: "chapters" },
  { path: "preKnowledge", ref: "items" },
  { path: "test", ref: "tests" },
]);

export const LessonModel = mongoose.model<ILesson & mongoose.Document>(
  "lessons",
  LessonSchema
);
