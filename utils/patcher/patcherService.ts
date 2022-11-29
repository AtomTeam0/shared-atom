import { WatchMode } from "../../enums/WatchMode";
import { IItem, IItemGroup } from "../../interfaces/item.interface";
import { IChapter } from "../../interfaces/chapter.interface";
import { IUser } from "../../interfaces/user.interface";
import { patchDocsWithBoolean, patchDocsWithObject } from "./patcher";
import { ILesson } from "../../interfaces/lesson.interface";
import { IMedia } from "../../interfaces/media.interface";

export class PatcherService {
  // regulars
  static itemPatcher(items: IItem | IItem[]): IItem | IItem[] {
    const itemOptions = {
      foreignArrayProperty: "favorites" as keyof IUser,
      localBoolProperty: "isFavorite" as keyof IItem,
      defaultValue: false,
    };
    return patchDocsWithBoolean<IItem>(items, itemOptions);
  }

  static chapterPatcher(
    chapters: IChapter | IChapter[]
  ): IChapter | IChapter[] {
    const chapterOptions = {
      foreignArrayProperty: "chapters" as keyof IUser,
      foreignIdProperty: "chapterId" as keyof IUser,
      defaultValue: { watchMode: WatchMode.UNREAD },
    };
    return patchDocsWithObject<IChapter>(chapters, chapterOptions);
  }

  static mediaPatcher(medias: IMedia | IMedia[]): IMedia | IMedia[] {
    const mediaOptions = {
      foreignArrayProperty: "media" as keyof IUser,
      foreignIdProperty: "mediaId" as keyof IUser,
      defaultValue: { watchMode: WatchMode.UNREAD },
    };
    return patchDocsWithObject<IMedia>(medias, mediaOptions);
  }

  // with child properties
  static itemGroupPatcher(itemGroups: IItemGroup[]): IItemGroup[] {
    const isArray = Array.isArray(itemGroups);
    return (isArray ? itemGroups : [itemGroups]).map(
      (itemGroup: IItemGroup) => ({
        ...itemGroup,
        items: PatcherService.itemPatcher(
          itemGroup.items as IItem[]
        ) as IItem[],
      })
    );
  }

  static lessonPatcher(lessons: ILesson | ILesson[]): ILesson | ILesson[] {
    const isArray = Array.isArray(lessons);
    return (isArray ? lessons : [lessons]).map((lesson: ILesson) => ({
      ...lesson,
      chapters: PatcherService.chapterPatcher(
        lesson.chapters as IChapter[]
      ) as IChapter[],
    }));
  }

  static userPatcher(users: IUser | IUser[]): IUser | IUser[] {
    const isArray = Array.isArray(users);
    return (isArray ? users : [users]).map((user: IUser) => ({
      ...user,
      favorites: PatcherService.itemPatcher(
        user.favorites as IItem[]
      ) as IItem[],
      lastWatched: PatcherService.itemPatcher(
        user.lastWatched as IItem[]
      ) as IItem[],
    }));
  }
}
