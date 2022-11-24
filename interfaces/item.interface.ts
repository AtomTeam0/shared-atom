import { Category } from "../enums/Category";
import { ContentType } from "../enums/ContentType";
import { Corp } from "../enums/Corp";
import { Grade } from "../enums/Grade";
import { Section } from "../enums/Section";
import { IArea } from "./area.interface";
import { IUnit } from "./unit.interface";
import { IUser } from "./user.interface";

export interface IItemQuery {
  areaId?: string;
  section?: Section;
  category?: Category;
  contentType?: ContentType;
  isAll?: boolean;
  search?: string;
}

export interface IMinimalItem {
  title: string;
  contentType: ContentType;
  editedBy: string | IUser;
}

export interface IItem {
  id?: string;
  updatedAt: Date;
  title: string;
  description: string;
  views: number;
  priority: number;
  isActive: boolean;
  sections: Section[];
  categories: Category[];
  corps: Corp[];
  grade: Grade;
  contentType: ContentType;
  thumbNail: string;
  contentId: string;
  editedBy: string | IUser;
  areas: string[] | IArea[];
  unit: string | IUnit;
  similarItems: string[] | IItem[];
  isFavorite?: boolean;
}

export interface IItemGroup {
  category: Category;
  items: IItem[];
}
