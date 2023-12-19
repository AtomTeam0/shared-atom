import * as mongoose from "mongoose";
import {FiltersGroup} from "common-atom/interfaces/filter.interface";
import {aggregatePlugin} from "../utils/schema/plugins/aggregatePlugin";
import {atLeastOneInArray} from "./validators/general";

const FiltersGroupSchema: mongoose.Schema = new mongoose.Schema(
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
        filters: {
            type: [mongoose.Types.ObjectId],
            required: true,
            ref: "filters",
            validate: atLeastOneInArray<mongoose.Types.ObjectId>
        },
        ancestorFilters: {
            type: [mongoose.Types.ObjectId],
            ref: "filters",
        },
    },
    {
        versionKey: false,
        timestamps: { createdAt: false, updatedAt: false },
    }
);

// plugins
FiltersGroupSchema.plugin(aggregatePlugin);
export const FiltersGroupModel = mongoose.model<FiltersGroup & mongoose.Document>(
    "filtersGroups",
    FiltersGroupSchema
);
