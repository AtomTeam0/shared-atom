import * as mongoose from "mongoose";
import { ITest } from "../interfaces/test.interface";

const TestSchema: mongoose.Schema = new mongoose.Schema(
  {
    questions: {
      type: {
        question: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
        },
        correctAnswer: {
          type: String,
          required: true,
        },
      },
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

export const TestModel = mongoose.model<ITest & mongoose.Document>(
  "tests",
  TestSchema
);
