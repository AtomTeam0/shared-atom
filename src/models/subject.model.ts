import * as mongoose from "mongoose";
import { ISubject } from "common-atom/interfaces/subject.interface";
import { Functions } from "common-atom/enums/Functions";
import { CombatShapes } from "common-atom/enums/CombatShapes";
import { Compound } from "common-atom/enums/Compound";
import { Degree } from "common-atom/enums/Degree";
import { Publish } from "common-atom/enums/publish";
import { Job } from "common-atom/enums/Job";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";
import { config } from "../config";

const subjectSchema: mongoose.Schema = new mongoose.Schema(
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
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    jobs: {
      type: [Job],
      required: true,
    },
    publishTypes: {
      type: [Publish],
      required: true,
    },
    degrees: {
      type: [Degree],
      required: true,
    },
    compounds: {
      type: [Compound],
      required: true,
    },
    combatShapes: {
      type: [CombatShapes],
      required: true,
    },
    functions: {
      type: [Functions],
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
subjectSchema.plugin(populatePlugin<ISubject>, [
  { property: "book", ref: "books" },
]);
subjectSchema.plugin(
  blobPlugin<ISubject>,
  config.formidable.propertyConfigs.subject
);

export const SubjectModel = mongoose.model<ISubject & mongoose.Document>(
  "subjects",
  subjectSchema
);
