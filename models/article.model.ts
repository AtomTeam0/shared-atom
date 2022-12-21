import * as mongoose from "mongoose";
import { FileTypes } from "../common/enums/helpers/FileTypes";
import { IArticle } from "../common/interfaces/article.interface";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { CommentModel } from "./comment.model";

const ArticleSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    writtenBy: {
      type: String,
      required: true,
    },
    pdfURL: {
      type: String,
      required: true,
    },
    bestSoldier: {
      type: {
        name: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
      },
    },
    category: {
      type: String,
      required: true,
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: CommentModel,
      default: [],
    },
    thumbNail: {
      type: String,
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
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// plugins
ArticleSchema.plugin(populatePlugin, [
  { path: "comments", ref: "comments", isArray: true },
]);
ArticleSchema.plugin(blobPlugin, [
  {
    propertyName: "thumbNail",
    fileType: FileTypes.IMAGE,
  },
  {
    fatherProperty: "bestSoldier",
    propertyName: "image",
    fileType: FileTypes.IMAGE,
  },
]);

export const ArticleModel = mongoose.model<IArticle & mongoose.Document>(
  "articles",
  ArticleSchema
);
