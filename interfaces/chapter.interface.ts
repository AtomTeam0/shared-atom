import { IUserChapterPatch } from "./user.interface";

export interface IChapter extends IUserChapterPatch {
  id?: string;
  title: string;
  description?: string;
  iframe: string;
}
