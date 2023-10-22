import { Request, Response, NextFunction } from "express";
import * as formidable from "formidable";
import { IFileDetails } from "common-atom/interfaces/helpers/file.interface";
import { wrapAsyncMiddleware } from "../helpers/wrapper";

export function formidableMiddleware() {
  // convert file into JSON object
  const mergeDataIntoJSON = (data: Record<string, any>, targetJSON: object) => {
    Object.entries(data).forEach(([key, value]) => {
      const keys = key.split('.');
      let current: any = targetJSON;
      keys.map((k, i) => {
        if (i === keys.length - 1) {
          current[k] = value;
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
        return key;
      });
    });
    return targetJSON;
  };
  const modifyKey = (key: string) => key.replace(']', '').replace('[', '.');

  // convert each file to minimized object
  const modifyValue = (val: Record<string, any>): string => {
    const { filepath, originalFilename } = val;
    const json: IFileDetails = {
      filepath,
      originalFilename,
    };
    return JSON.stringify(json);
  };

  return wrapAsyncMiddleware(async (req: Request, _res: Response, next: NextFunction) => {
    const form = formidable({ multiples: true });

    try {
      // Await the completion of form parsing
      await new Promise<void>((resolve, reject) => {
        form.parse(req, (err: any, fields: formidable.Fields, files: any) => {
          if (err) {
            reject(err);
          } else {
            req.body = {
              ...mergeDataIntoJSON(
                  Object.assign(
                      {},
                      ...Object.entries(files).map(([key, value]: any) => ({
                        [modifyKey(key)]: modifyValue(value),
                      }))
                  ),
                  fields
              ),
            };
            resolve();
          }
        });
      });
      next();
    } catch (error) {
      next(error);
    }
  });
}
