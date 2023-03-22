import * as mongoose from "mongoose";
import { INews } from "../common/interfaces/news.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { socketPlugin } from "../utils/schema/plugins/socketPlugin";

const NewsSchema: mongoose.Schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    area: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "areas",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

NewsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

// plugins
NewsSchema.plugin(populatePlugin<INews>, [{ property: "area", ref: "areas" }]);
NewsSchema.plugin(socketPlugin<INews>, {
  eventName: "createNews",
  roomNameProperty: "area.name",
});

export const NewsModel = mongoose.model<INews & mongoose.Document>(
  "news",
  NewsSchema
);
