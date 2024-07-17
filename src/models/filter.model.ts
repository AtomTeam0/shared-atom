import {Schema, Types, Document, model} from "mongoose";
import {IFilter} from "common-atom/interfaces/filter.interface";
import {aggregatePlugin} from "../utils/schema/plugins/aggregatePlugin";

const FilterSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        world: {
            type: Types.ObjectId,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        priority: {
            type: Number,
            validate: {
                validator: (val: number) => val <= 100 && val >= 1,
                message: `priority out of range (1-100)`,
            },

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
export const FilterModel = model<IFilter & Document>(
    "filters",
    FilterSchema
);
