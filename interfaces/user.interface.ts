import { Area } from "../enums/Area";
import { Permission } from "../enums/Permission";
import { Section } from "../enums/Section";
import { WatchMode } from "../enums/WatchMode";
import { IItem } from "./item.interface";

export interface IUserQuery {
  section: Section;
  area: Area;
}

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  section: Section;
  permission: Permission;
  favorites: string[] | IItem[];
  lastWatched: string[] | IItem[];
  employees: string[] | IUser[];
  podcasts: { podcastId: string; mode: WatchMode; note: string }[];
  chapters: { chapterId: string; mode: WatchMode }[];
}