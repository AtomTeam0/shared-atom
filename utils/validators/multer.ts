import { config } from "../../config";

const multer = require("multer");

export function multerMiddleware<T>(
  porpertyArray: Array<Extract<keyof T, string>>,
  fileSize = config.multer.maxSize,
  encoding = config.multer.encoding
) {
  return multer({ limit: { fileSize }, encoding }).buffer(porpertyArray, 1);
}
