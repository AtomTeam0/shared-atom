import { config } from "../../config";

const multer = require("multer");

type DeepKey<T> = {
  [K in keyof T]: T[K] extends object ? DeepKey<T[K]> : K;
};

type DeepKeyString<T> = {
  [K in keyof DeepKey<T>]: string;
}[keyof DeepKey<T>];

export function multerMiddleware<T>(
  porpertyArray: Array<Extract<DeepKeyString<T>, string>>,
  fileSize = config.multer.maxSize,
  encoding = config.multer.encoding
) {
  return multer({ limit: { fileSize }, encoding }).buffer(porpertyArray, 1);
}
