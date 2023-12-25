import * as mongoose from "mongoose";
import {FiltersGroup} from "common-atom/interfaces/filtersGroup.interface";
import {aggregatePlugin} from "../utils/schema/plugins/aggregatePlugin";
import {atLeastOneInArray} from "./validators/general";
import {populatePlugin} from "../utils/schema/plugins/populatePlugin";
import {IItem} from "common-atom/interfaces/item.interface";

const FiltersGroupSchema: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        world: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        filters: {
            type: [mongoose.Types.ObjectId],
            required: true,
            ref: "filters",
            validate: atLeastOneInArray<mongoose.Types.ObjectId>
        },
        isLast: {
            type: Boolean,
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


FiltersGroupSchema.plugin(populatePlugin<IItem>, [
    { property: "filters", ref: "filters", isArray: true },
    { property: "world", ref: "worlds" },
]);

// plugins
FiltersGroupSchema.plugin(aggregatePlugin);
export const FiltersGroupModel = mongoose.model<FiltersGroup & mongoose.Document>(
    "filtersGroups",
    FiltersGroupSchema
);
