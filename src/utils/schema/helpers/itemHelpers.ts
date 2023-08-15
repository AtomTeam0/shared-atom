import { IItem } from "common-atom/interfaces/item.interface";
import { config } from "../../../config";
import { uploadFile } from "./fileHelpers";

// uploads the items files by force instead of the file plugin
// explaination for this is on the arcitechure excel in drive
export const handleItemBlobCreation = async (item: IItem) => {
  const fileObjects = await Promise.all(
    config.formidable.propertyConfigs.item.map(async (property) => {
      const fileDetails = JSON.parse(item[property as keyof IItem] as string);
      return { [property]: await uploadFile(fileDetails) };
    })
  );
  Object.assign(item, ...fileObjects);
};
