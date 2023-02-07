import { Request, Response, NextFunction } from "express";
import * as formidable from "formidable";
import {
  FileTypes,
  getFileSizeByFileType,
  getMimeTypeByFileType,
} from "../../common/enums/helpers/FileTypes";
import { config } from "../../config";
import { UnsupportedFileSize, UnsupportedFileType } from "../errors/filesError";
import { PorpertyOptionalDeep } from "../helpers/types";
import { wrapAsyncMiddleware } from "../helpers/wrapper";

export function formidableMiddleware<T>(
  porpertyArray: {
    property: PorpertyOptionalDeep<T>;
    fileType: FileTypes;
  }[],
  isItemCreation = false
) {
  function mergeDataIntoJSON(data: Record<string, any>, targetJSON: object) {
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
  }

  return wrapAsyncMiddleware(
    async (req: Request, _res: Response, next: NextFunction) => {
      const form = formidable({ multiples: true });
      const allProperties = [
        ...porpertyArray,
        ...(isItemCreation ? config.formidable.propertyConfigs.item : []),
      ];

      // validations
      form.on("file", (formname: string, file: any) => {
        const property = allProperties.find((prop) =>
          formname.includes(prop.property)
        );
        const isValidSize =
          property &&
          file.size &&
          file.size <= getFileSizeByFileType(property.fileType);
        const isValidMimeType =
          property &&
          file.mimetype &&
          getMimeTypeByFileType(property.fileType).includes(file.mimetype);

        if (!isValidSize) {
          next(new UnsupportedFileSize(file.size || undefined));
        }
        if (!isValidMimeType) {
          next(new UnsupportedFileType(file.mimetype || undefined));
        }

        form.emit("data", {
          name: "file",
          formname,
          value: file,
        });
      });

      // convertion
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) {
          next(err);
        }
        req.body = mergeDataIntoJSON(
          Object.assign(
            {},
            ...Object.entries(files).map(([key, value]: any) => ({
              [key.replace("]", "").replace("[", ".")]: value,
            }))
          ),
          fields
        );
        next();
      });
    }
  );
}
