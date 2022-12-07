import * as mongoose from "mongoose";
import { INews } from "../common/interfaces/news.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { socketPlugin } from "../utils/schema/plugins/socketPlugin";
import { AreaModel } from "./area.model";

const NewsSchema: mongoose.Schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    area: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: AreaModel,
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
    timestamps: { createdAt: true, updatedAt: false },
  }
);

NewsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

// plugins
NewsSchema.plugin(populatePlugin, [{ path: "area", ref: "areas" }]);
NewsSchema.plugin(socketPlugin, {
  eventName: "createNews",
  roomNameProperty: "area",
  innerRoomNameProperty: "name",
});

export const NewsModel = mongoose.model<INews & mongoose.Document>(
  "news",
  NewsSchema
);
