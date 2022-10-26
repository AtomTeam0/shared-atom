import { WatchMode } from "../enums/WatchMode";
import { IItem } from "./item.interface";
import { IUser } from "./user.interface";

export interface IMissionQuery {
  director?: string;
  editor?: string;
}

export interface IMission {
  id?: string;
  notes?: string;
  complitionDate: Date;
  status?: WatchMode;
  director?: string | IUser;
  editor: string | IUser;
  item?: string | IItem;
}
