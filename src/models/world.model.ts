import {Schema, Document, model} from "mongoose";
import {aggregatePlugin} from "../utils/schema/plugins/aggregatePlugin";
import {World} from "common-atom/interfaces/world.interface";

const WorldSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
      priority: {
        type: Number,
        required: true,
      },
        thumbnail: {
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
export const WorldModel = model<World & Document>(
    "worlds",
    WorldSchema
);
