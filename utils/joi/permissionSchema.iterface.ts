import { ObjectSchema } from "joi";
import { Permission } from "../../enums/Permission";

export interface IPermissionSchema {
  permissions: Permission[];
  schema: ObjectSchema<any>;
}
