import {Schema, Types, Document, model} from "mongoose";
import {FiltersGroup} from "common-atom/interfaces/filtersGroup.interface";
import {aggregatePlugin} from "../utils/schema/plugins/aggregatePlugin";
import {atLeastOneInArray} from "./validators/general";
import {populatePlugin} from "../utils/schema/plugins/populatePlugin";
import {IItem} from "common-atom/interfaces/item.interface";

const FiltersGroupSchema: Schema = new Schema(
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
            type: Types.ObjectId,
            required: true,
        },
        filters: {
            type: [Types.ObjectId],
            required: true,
            ref: "filters",
            validate: atLeastOneInArray<Types.ObjectId>
        },
        isLast: {
            type: Boolean,
        },
        ancestorFilters: {
            type: [Types.ObjectId],
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
export const FiltersGroupModel = model<FiltersGroup & Document>(
    "filtersGroups",
    FiltersGroupSchema
);
