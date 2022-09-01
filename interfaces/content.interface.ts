import { ContentType } from '../enums/ContentType';
import { ILesson } from './lesson.interface';
import { IPakal } from './pakal.interface';

export interface IContentQuery {
    itemId: string;
    contentId: string;
    contentType: ContentType;
}

export type IAllContent = ILesson | IPakal; // | IPakal | IPodcast...
