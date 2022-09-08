import { ContentType } from "../enums/ContentType";
import { IInfographic } from "./infographic.interface";
import { ILesson } from "./lesson.interface";
import { IMedia } from "./media.interface";
import { IPakal } from "./pakal.interface";

export interface IContentQuery {
  itemId: string;
  contentId: string;
  contentType: ContentType;
}

export type IAllContent = ILesson | IPakal | IMedia | IInfographic;
