import { Request, Response, NextFunction } from "express";
import { config } from "../../config";
import { UnsupportedFileType } from "../errors/validationError";
import { PorpertyOptionalDeep } from "../helpers/types";
import { wrapAsyncMiddleware } from "../helpers/wrapper";

const multer = require("multer");

export function multerMiddleware<T>(
  porpertyArray: Array<PorpertyOptionalDeep<T>>,
  fileSize = config.multer.maxSize,
  encoding = config.multer.encoding,
  fileTypes = config.multer.fileTypes
) {
  const multerOption = {
    limit: { fileSize },
    encoding,
    fileFilter: (
      req: Request,
      file: any,
      cb: (error: Error | null, acceptFile: boolean) => void
    ) => {
      if (!fileTypes.includes(file.mimetype)) {
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
        if (req.files) {
          Object.keys(req.files).forEach((key) => {
            const [file] = (req.files as any)[key];
            req.body[key] = file.buffer;
          });
        }
        next();
      })
  );
}
