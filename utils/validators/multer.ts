import { Request, Response, NextFunction } from "express";
import {
  FileTypes,
  getMimeTypeByFileType,
} from "../../common/enums/helpers/FileTypes";
import { config } from "../../config";
import { UnsupportedFileType } from "../errors/validationError";
import { PorpertyOptionalDeep } from "../helpers/types";
import { wrapAsyncMiddleware } from "../helpers/wrapper";

const multer = require("multer");

export function multerMiddleware<T>(
  porpertyArray: {
    property: PorpertyOptionalDeep<T>;
    fileType: FileTypes;
  }[],
  fileSize = config.multer.maxSize,
  encoding = config.multer.encoding
) {
  const multerOption = {
    limit: { fileSize },
    encoding,
    fileFilter: (
      req: Request,
      file: any,
      cb: (error: Error | null, acceptFile: boolean) => void
    ) => {
      const propertyToCheck = porpertyArray.find(
        (property) => property === file.fieldname
      );

      if (
        propertyToCheck &&
        !getMimeTypeByFileType(propertyToCheck.fileType).includes(file.mimetype)
      ) {
        throw new UnsupportedFileType(file.mimetype);
      } else {
        cb(null, true);
      }
    },
  };

  return wrapAsyncMiddleware(
    async (req: Request, res: Response, next: NextFunction) =>
      multer(multerOption).fields(
        porpertyArray.map((property) => ({ name: property, maxCount: 1 }))
      )(req, res, () => {
        if ((req as any).files) {
          Object.keys((req as any).files).forEach((key) => {
            const [file] = (req as any).files[key];
            req.body[key] = file.buffer;
          });
        }
        next();
      })
  );
}
