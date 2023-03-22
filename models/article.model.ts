import * as mongoose from "mongoose";
import { IArticle } from "../common/interfaces/article.interface";
import { config } from "../config";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";

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
    pdf: {
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
      ref: "comments",
      default: [],
    },
    thumbNail: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// plugins
ArticleSchema.plugin(populatePlugin<IArticle>, [
  { property: "comments", ref: "comments", isArray: true },
]);
ArticleSchema.plugin(
  blobPlugin<IArticle>,
  config.formidable.propertyConfigs.article
);

export const ArticleModel = mongoose.model<IArticle & mongoose.Document>(
  "articles",
  ArticleSchema
);
