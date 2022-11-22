import { Permission } from "../enums/Permission";
import { Section } from "../enums/Section";
import { WatchMode } from "../enums/WatchMode";
import { IArea } from "./area.interface";
import { IItem } from "./item.interface";

export interface IUserQuery {
  search: string;
}

export interface ILastWatchedQuery {
  area: string;
  section: Section;
}
export interface IUserChapterPatch {
  mode?: WatchMode;
}

export interface IUserMediaPatch {
  mode?: WatchMode;
  note?: string;
}
export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  permission: Permission;
  area: string | IArea;
  favorites: string[] | IItem[];
  lastWatched: string[] | IItem[];
  employees?: string[] | IUser[];
  media: { mediaId: string; mode: WatchMode; note: string }[];
  chapters: { chapterId: string; mode: WatchMode }[];
}

export interface IUserUpdater extends IUser {
  toggleFavorite?: string;
  toggleEmployee?: string;
}
