import { ObjectSchema } from "joi";
import { Permission } from "../../common/enums/Permission";

export interface IPermissionSchema {
  permissions: Permission[];
  schema: ObjectSchema<any>;
}
