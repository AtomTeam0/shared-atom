import { AxiosError } from "axios";
import { FileDownloadError } from "../../errors/filesError";
import {
  PropertyOptionalDeep,
  propertyValGetter,
  propertyValSetter,
} from "../../helpers/types";
import { getFileUrl, uploadFile } from "./fileHelpers";

// a function used to uplaod & replace a file property within an object
async function modifyProperties<T>(
  doc: any,
  options: PropertyOptionalDeep<T>[],
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
  options: PropertyOptionalDeep<T>[],
  isMultipleFunction = false
) {
  return modifyProperties<T>(doc, options, async (blobName: string) => {
    try {
      console.log("In modifyProperties getFileUrl with blobName", blobName);
      const file = await getFileUrl(blobName);
      return file;
    } catch (error) {
      if (!isMultipleFunction) {
        if (!(error instanceof FileDownloadError)) {
          throw new FileDownloadError(
            "Unknown error",
            (error as AxiosError).status
          );
        }
        throw error;
      }
      return undefined;
    }
  });
}

export async function createProperties<T>(
  doc: any,
  options: PropertyOptionalDeep<T>[]
) {
  return modifyProperties<T>(doc, options, (path: string) =>
    uploadFile(JSON.parse(path))
  );
}
