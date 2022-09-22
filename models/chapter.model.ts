import * as mongoose from "mongoose";
import { patchObjectPlugin } from "../../microServices/lesson-service/shared/utils/schema/plugins/patchPlugin";
import { WatchMode } from "../enums/WatchMode";
import { IChapter } from "../interfaces/chapter.interface";

const ChapterSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    page: {
      type: Number,
      required: true,
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
ChapterSchema.plugin(patchObjectPlugin, {
  foreignArrayProperty: "chapters",
  foreignIdProperty: "chapterId",
  defaultValue: { mode: WatchMode.UNREAD },
});

export const ChapterModel = mongoose.model<IChapter & mongoose.Document>(
  "chapters",
  ChapterSchema
);
