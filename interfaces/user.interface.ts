import { Permission } from '../enums/Permission';
import { WatchMode } from '../enums/WatchMode';
import { IItem } from './item.interface';

export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    permission: Permission;
    favorites: string[] | IItem[];
    lastWatched: string[] | IItem[];
    employees: string[] | IUser[];
    podcasts: { podcastId: string; mode: WatchMode; note: string }[];
    chapters: { chapterId: string; mode: WatchMode }[];
}
