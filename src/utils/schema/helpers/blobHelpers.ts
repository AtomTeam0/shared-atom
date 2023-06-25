import * as mongoose from "mongoose";
import { FileTypes } from "common-atom/enums/helpers/FileTypes";
import { putSkipPlugins, runWithContext } from "../../helpers/context";
import {
  PorpertyOptionalDeep,
  propertyValGetter,
  propertyValSetter,
} from "../../helpers/types";
import { downloadBlob, createBlob, updateBlob } from "./azureHelpers";

async function getOldBlobName<T>(
  query: mongoose.Query<any, any>,
  property: PorpertyOptionalDeep<T>
) {
  const wantedId = query.getFilter()._id;
  const oldDoc = await runWithContext(() => {
    putSkipPlugins();
    return query.model.findById(wantedId).exec();
  });
  if (oldDoc) {
    return propertyValGetter<T>(oldDoc, property);
  }
  return undefined;
}

async function modifyProperties<T>(
  doc: any,
  options: {
    property: PorpertyOptionalDeep<T>;
    fileType: FileTypes;
  }[],
  blobAction: (...args: any) => Promise<string>
) {
  return Promise.all(
    options.map(async (option) => {
      const currentVal = propertyValGetter<T>(doc, option.property);
      return (
        currentVal &&
        propertyValSetter<T>(
          doc,
          option.property,
          await blobAction(currentVal, option)
        )
      );
    })
  );
}

export async function downloadProperties<T>(
  doc: any,
  options: {
    property: PorpertyOptionalDeep<T>;
    fileType: FileTypes;
  }[]
) {
  return modifyProperties<T>(
    doc,
    options,
    (
      blobName: string,
      property: {
        property: PorpertyOptionalDeep<T>;
        fileType: FileTypes;
      }
    ) => downloadBlob(blobName, property.fileType)
  );
}

export async function createProperties<T>(
  doc: any,
  options: {
    property: PorpertyOptionalDeep<T>;
    fileType: FileTypes;
  }[]
) {
  return modifyProperties<T>(
    doc,
    options,
    (
      path: string,
      property: {
        property: PorpertyOptionalDeep<T>;
        fileType: FileTypes;
      }
    ) => createBlob(JSON.parse(path), property.fileType)
  );
}

export async function updateProperties<T>(
  doc: any,
  options: {
    property: PorpertyOptionalDeep<T>;
    fileType: FileTypes;
  }[],
  query: mongoose.Query<any, any>
) {
  return modifyProperties<T>(
    doc,
    options,
    async (
      path: string,
      property: {
        property: PorpertyOptionalDeep<T>;
        fileType: FileTypes;
      }
    ) => {
      const oldBlobName = await getOldBlobName<T>(query, property.property);
      return (
        oldBlobName &&
        updateBlob(JSON.parse(path), property.fileType, oldBlobName)
      );
    }
  );
}
