import * as mongoose from "mongoose";
import {aggregatePlugin} from "../utils/schema/plugins/aggregatePlugin";
import {IWorld} from "common-atom/interfaces/world.interface";

const WorldSchema: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        Icon: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
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
WorldSchema.plugin(aggregatePlugin);
export const WorldModel = mongoose.model<IWorld & mongoose.Document>(
    "worlds",
    WorldSchema
);