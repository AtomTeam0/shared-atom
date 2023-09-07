import { AxiosError } from "axios";
import { FileDownloadError } from "../../errors/filesError";
import {
  PorpertyOptionalDeep,
  propertyValGetter,
  propertyValSetter,
} from "../../helpers/types";
import { getFileUrl, uploadFile } from "./fileHelpers";

// a function used to uplaod & replace a file property within an object
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

// a function used to download a file property within an object
export async function downloadProperties<T>(
  doc: any,
  options: PorpertyOptionalDeep<T>[],
  isMultipleFunction = false
) {
  return modifyProperties<T>(doc, options, async (blobName: string) => {
    // Fetch the data from Hatch and if data not sanitized return Undefined;
    try {
      console.log("In modifyProperties getFileUrl with blobName", blobName);
      const file = await getFileUrl(blobName);
      return file;
    } catch (error) {
      // if its a single doc return value function - throw the error
      if (!isMultipleFunction) {
        if (!(error instanceof FileDownloadError)) {
          throw new FileDownloadError(
            "Unknown error",
            (error as AxiosError).status
          );
        }
        // else its already our error
        throw error;
      }
      // else return undefined instead of the file and ater on filter this document out inside genericPostMiddleware
      return undefined;
    }
  });
}
// a function used to upload a file property within an object
export async function createProperties<T>(
  doc: any,
  options: PorpertyOptionalDeep<T>[]
) {
  return modifyProperties<T>(doc, options, (path: string) =>
    uploadFile(JSON.parse(path))
  );
}
