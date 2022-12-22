import { config } from "../../config";
import { PorpertyOptionalDeep } from "../helpers/types";

const multer = require("multer");

export function multerMiddleware<T>(
  porpertyArray: Array<PorpertyOptionalDeep<T>>,
  fileSize = config.multer.maxSize,
  encoding = config.multer.encoding
) {
  return multer({ limit: { fileSize }, encoding }).buffer(porpertyArray, 1);
}
