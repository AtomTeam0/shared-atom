import { Request, Response, NextFunction } from "express";
import * as formidable from "formidable";
import { IFileDetails } from "common-atom/interfaces/helpers/file.interface";
import { wrapAsyncMiddleware } from "../helpers/wrapper";

export function formidableMiddleware() {
  const mergeDataIntoJSON = (data: Record<string, any>, targetJSON: object) => {
    Object.entries(data).forEach(([key, value]) => {
      const keys = key.split(".");
      let current: any = targetJSON;
      keys.forEach((k, i) => {
        if (i === keys.length - 1) {
          current[k] = value;
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
      });
    });
    return targetJSON;
  };

  const modifyKey = (key: string) => key.replace("]", "").replace("[", ".");

  const modifyValue = (val: Record<string, any>): string => {
    const { filepath, originalFilename } = val;
    const json: IFileDetails = {
      filepath,
      originalFilename,
    };
    return JSON.stringify(json);
  };

  return wrapAsyncMiddleware(
    async (req: Request, _res: Response, next: NextFunction) => {
      const form = formidable({ multiples: true });

      // Wrap the form.parse() in a Promise
      const parseForm = () =>
        new Promise<void>((resolve, reject) => {
          form.parse(req, (err: any, fields: any, files: any) => {
            if (err) {
              reject(err);
            } else {
              req.body = mergeDataIntoJSON(
                Object.assign(
                  {},
                  ...Object.entries(files).map(([key, value]: any) => ({
                    [modifyKey(key)]: modifyValue(value),
                  }))
                ),
                fields
              );
              resolve();
            }
          });
        });

      try {
        // Await the completion of form parsing
        await parseForm();
        next();
      } catch (error) {
        next(error);
      }
    }
  );
}
