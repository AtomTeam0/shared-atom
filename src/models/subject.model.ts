import * as mongoose from "mongoose";
import { ISubject } from "common-atom/interfaces/subject.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { aggregatePlugin } from "../utils/schema/plugins/aggregatePlugin";

const SubjectSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validator: (val: number) => val <= 3 && val >= 1,
        message: `priority out of range (1-3)`,
      },
    },
    pages: {
      type: [
        {
          type: mongoose.Schema.Types.Mixed,
          validate: {
            validator: (val: any) =>
              typeof val === "number" ||
              (val.from &&
                val.to &&
                typeof val.from === "number" &&
                typeof val.to === "number"),
            message:
              "pages must be a number or an object with 'from' and 'to' properties",
          },
        },
      ],
      _id: false,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    jobs: {
      type: [String],
      required: true,
    },
    publishTypes: {
      type: [String],
      required: true,
    },
    degrees: {
      type: [String],
      required: true,
    },
    compounds: {
      type: [String],
      required: true,
    },
    combatShapes: {
      type: [String],
      required: true,
    },
    functions: {
      type: [String],
      required: true,
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
SubjectSchema.plugin(populatePlugin<ISubject>, [
  { property: "book", ref: "books" },
]);
SubjectSchema.plugin(aggregatePlugin);
export const SubjectModel = mongoose.model<ISubject & mongoose.Document>(
  "subjects",
  SubjectSchema
);
