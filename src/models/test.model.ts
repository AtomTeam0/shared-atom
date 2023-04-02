import * as mongoose from "mongoose";
import { ITest } from "common-atom/interfaces/test.interface";

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
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const TestModel = mongoose.model<ITest & mongoose.Document>(
  "tests",
  TestSchema
);
