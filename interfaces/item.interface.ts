import { Area } from "../enums/Area";
import { Category } from "../enums/Category";
import { ContentType } from "../enums/ContentType";
import { Corp } from "../enums/Corp";
import { Grade } from "../enums/Grade";
import { Section } from "../enums/Section";
import { IUnit } from "./unit.interface";

export interface IItemQuery {
  area: Area;
  section: Section;
  category?: Category;
  contentType?: ContentType;
}

export interface IItem {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  views: number;
  priority: number;
  areas: Area[];
  sections: Section[];
  categories: Category[];
  corps: Corp[];
  grade: Grade;
  contentType: ContentType;
  thumbNail: string;
  contentId: string;
  unit: string | IUnit;
  similarItems: string[] | IItem[];
  isFavorite?: boolean;
}

export interface IItemDoc extends IItem {
  patchUserInfo: (userId: string) => any;
}
