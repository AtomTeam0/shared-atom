import { IUser } from "../../interfaces/user.interface";
import { UsersRPCService } from "../rpc/services/user.RPCservice";

export const getUserArray = async (
  foreignArrayProperty: keyof IUser & string
): Promise<any> => {
  const user = await UsersRPCService.getUserById();
  if (!user) {
    return [];
  }
  return user[foreignArrayProperty] as Array<string>;
};

export const userPatcher = async (
  foreignArrayProperty: keyof IUser & string,
  foreignIdProperty: string,
  localId: string
): Promise<any> => {
  const array = await getUserArray(foreignArrayProperty);
  const obj = array.find((item: any) => item[foreignIdProperty] === localId);
  if (obj) {
    delete obj[foreignIdProperty];
  }
  return obj;
};

export const userPatcherBoolean = async (
  foreignArrayProperty: keyof IUser & string,
  localId: string
): Promise<any> => {
  const array = await getUserArray(foreignArrayProperty);
  const doesExist = array.some((id: any) => id === localId);
  return doesExist;
};

export const patchInAggregation = async (options: {
  foreignArrayProperty: keyof IUser & string;
  foreignIdProperty: string;
  defaultValue: { [k: string]: any };
}) => {
  const patchArray = await getUserArray(options.foreignArrayProperty);
  return [
    {
      $addFields: {
        patch: {
          $filter: {
            input: patchArray,
            as: "singlePatch",
            cond: {
              $eq: [`$$singlePatch.${options.foreignIdProperty}`, "$_id"],
            },
            limit: 1,
          },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $cond: {
            if: { $ne: [{ $size: "$patch" }, 0] },
            then: {
              $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$patch", 0] }],
            },
            else: {
              $mergeObjects: ["$$ROOT", options.defaultValue],
            },
          },
        },
      },
    },
    {
      $unset: `${options.foreignIdProperty}`,
    },
  ];
};

export const patchBooleanInAggregation = async (options: {
  foreignArrayProperty: keyof IUser & string;
  localBoolProperty: string;
  defaultValue: boolean;
}) => {
  const patchArray = await getUserArray(options.foreignArrayProperty);
  return [
    {
      $addFields: {
        [options.localBoolProperty]: {
          $or: [{ $in: ["$_id", patchArray] }, options.defaultValue],
        },
      },
    },
  ];
};
