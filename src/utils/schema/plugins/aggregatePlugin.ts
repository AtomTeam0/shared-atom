import * as mongoose from "mongoose";

export function aggregatePlugin(schema: mongoose.Schema) {
  // eslint-disable-next-line no-param-reassign
  schema.statics.aggregateSingleByCond = function (pipeline, cond = false) {
    return new Promise((resolve, reject) => {
      this.aggregate(pipeline).exec((err, results) => {
        if (err) {
          reject(err);
        } else {
          let finalRes = results;
          if (cond) {
            [finalRes] = results;
          }
          resolve(finalRes);
        }
      });
    });
  };
}
