import { ContentType } from "../enums/ContentType";
import { WatchMode } from "../enums/WatchMode";
import { IItem } from "./item.interface";
import { IUser } from "./user.interface";

export interface IMissionQuery {
  editor?: string;
}

export interface IMissionCreator {
  title: string;
  contentType: ContentType;
  notes?: string;
  startDate: Date;
  complitionDate: Date;
  director: string | IUser;
  editor: string | IUser;
}

export interface IMission {
  id?: string;
  notes?: string;
  startDate: Date;
  complitionDate: Date;
  status: WatchMode;
  director: string | IUser;
  editor: string | IUser;
  item: string | IItem;
}
