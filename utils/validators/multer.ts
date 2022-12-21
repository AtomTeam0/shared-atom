import * as multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export function multerMiddleware<T>(porpertyArray: [keyof T]) {
  return upload.fields(
    porpertyArray.map((property) => ({ name: property as string }))
  );
}
