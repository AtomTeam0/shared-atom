import * as JoiBase from "joi";
import {
  FileTypes,
  getMimeTypeByFileType,
} from "../../enums/helpers/FileTypes";

const base64toBlob = (base64Data: string, fileType: FileTypes) => {
  const sliceSize = 1024;
  const byteCharacters = Buffer.from(base64Data, "base64").toString();
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: getMimeTypeByFileType(fileType) });
};

const Joi = JoiBase.extend((joi: any) => ({
  type: "joiBlob",
  base: joi.string(),
  messages: {
    "joiBlob.invalid": "{{#label}} must be a base64 string",
  },
  rules: {
    fileType: {
      args: [
        {
          name: "fileType",
          ref: true,
          assert: (value) => Object.values(FileTypes).includes(value),
          message: "must be a fileType",
        },
      ],
      method(fileType) {
        return this.$_setFlag("fileType", fileType);
      },
    },
  },
  validate(value, helpers) {
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const isValid = base64regex.test(value);
    if (!isValid) {
      return { value, errors: helpers.error("joiBlob.invalid") };
    }
    return { value: base64toBlob(value, helpers.schema.$_getFlag("fileType")) };
  },
}));

export const joiEnum = (enumObj: { [k: string]: string }) =>
  Joi.string().valid(...Object.values(enumObj));

export const joiBlob = (fileType: FileTypes) =>
  Joi.joiBlob().fileType(fileType);

export const joiMongoId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const joiPersonalId = Joi.string().regex(/^[0-9]{9}$/);

export const joiPdfURL = Joi.string().regex(/^(http.+)(\.pdf)$/);

export const joiCoordinateAxis = Joi.string().regex(
  /^-?[0-9]{1,3}(?:\.[0-9]{1,15})?$/
);
