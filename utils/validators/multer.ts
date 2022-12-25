import { Request, Response, NextFunction } from "express";
import { config } from "../../config";
import { UnsupportedFileType } from "../errors/validationError";
import { PorpertyOptionalDeep } from "../helpers/types";

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
        cb(new UnsupportedFileType(file.mimetype), false);
      } else {
        cb(null, true);
      }
    },
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    await multer(multerOption).fields(
      porpertyArray.map((property) => ({ name: property, maxCount: 1 }))
    );

    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        const [buffer] = (req.files as any)[key];
        req.body[key] = buffer;
      });
    }

    next();
  };
}
