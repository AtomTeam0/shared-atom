import {
  PorpertyOptionalDeep,
  propertyValGetter,
  propertyValSetter,
} from "../../helpers/types";
import { getFileUrl, uploadFile } from "./fileHelpers";

async function modifyProperties<T>(
  doc: any,
  options: PorpertyOptionalDeep<T>[],
  blobAction: (...args: any) => Promise<string>
) {
  return Promise.all(
    options.map(async (property) => {
      const currentVal = propertyValGetter<T>(doc, property);
      return (
        currentVal &&
        propertyValSetter<T>(
          doc,
          property,
          await blobAction(currentVal, property)
        )
      );
    })
  );
}

export async function downloadProperties<T>(
  doc: any,
  options: PorpertyOptionalDeep<T>[]
) {
  return modifyProperties<T>(doc, options, (blobName: string) =>
    getFileUrl(blobName)
  );
}

export async function createProperties<T>(
  doc: any,
  options: PorpertyOptionalDeep<T>[]
) {
  return modifyProperties<T>(doc, options, (path: string) =>
    uploadFile(JSON.parse(path))
  );
}
