import * as mongoose from "mongoose";
import {IFilter} from "common-atom/interfaces/filter.interface";
import {aggregatePlugin} from "../utils/schema/plugins/aggregatePlugin";

const FilterSchema: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        world: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        timeDeleted: {
            type: Date,
        },
    },
    {
        versionKey: false,
        timestamps: { createdAt: false, updatedAt: false },
    }
);

// plugins
FilterSchema.plugin(aggregatePlugin);
export const FilterModel = mongoose.model<IFilter & mongoose.Document>(
    "filters",
    FilterSchema
);
