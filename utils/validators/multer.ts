import * as multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export function multerMiddleware<T>(
  porpertyArray: Array<keyof T>,
  deepPropertyArray: Array<{
    fatherProprty: keyof T;
    childProperty: string;
  }> = []
) {
  return upload.fields([
    ...porpertyArray.map((property) => ({ name: property as string })),
    ...deepPropertyArray.map((property) => ({
      name: `${property.fatherProprty as string}.${property.childProperty}`,
    })),
  ]);
}
