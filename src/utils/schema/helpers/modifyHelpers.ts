import { FileDownloadError } from "../../errors/filesError";
import {
  PorpertyOptionalDeep,
  propertyValGetter,
  propertyValSetter,
} from "../../helpers/types";
import { getFileUrl, uploadFile } from "./fileHelpers";

async function modifyProperties<T>(
  doc: any,
  options: PorpertyOptionalDeep<T>[],
  blobAction: (...args: any) => Promise<string> | undefined
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
  return modifyProperties<T>(doc, options, (blobName: string) => {
    // Fetch the data from Hatch and if data not sanitized return Undefined;
    try {
      console.log('In modifyProperties getFileUrl with blobName', blobName)
      const file = getFileUrl(blobName)
      return file;
      // If error was thrown, if error was expected(403) return 403, else throw it again to be handled by errorHandler
    } catch (error) {
      console.log("error was thrown in download", error, "blob", blobName);
      const fileError = error as FileDownloadError;
      if (fileError.status === 403)
        return undefined;
      throw fileError;
    }
  }
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
