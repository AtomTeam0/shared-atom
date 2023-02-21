import { IItem } from "../../../common/interfaces/item.interface";
import { config } from "../../../config";
import { createBlob } from "./blobHelpers";

export const handleItemBlobCreation = async (item: IItem) => {
  const fileObjects = await Promise.all(
    config.formidable.propertyConfigs.item.map(async (prop) => {
      const jsonString = item[prop.property as keyof IItem];
      const json = JSON.parse(jsonString as string);
      return { [prop.property]: await createBlob(json, prop.fileType) };
    })
  );
  Object.assign(item, ...fileObjects);
};
