import { WatchMode } from "../../common/enums/WatchMode";
import { IItem, IItemGroup } from "../../common/interfaces/item.interface";
import { IChapter } from "../../common/interfaces/chapter.interface";
import { IUser } from "../../common/interfaces/user.interface";
import { patchDocsWithBoolean, patchDocsWithObject } from "./patcher";
import { ILesson } from "../../common/interfaces/lesson.interface";
import { IMedia } from "../../common/interfaces/media.interface";
import { IPaginator } from "../../common/interfaces/helpers/paginator.interface";

export class PatcherService {
  // regulars
  static async itemPatcher(
    items: IItem | IItem[],
    isLean = false
  ): Promise<IItem | IItem[]> {
    const itemOptions = {
      foreignArrayProperty: "favorites" as keyof IUser,
      localBoolProperty: "isFavorite" as keyof IItem,
      defaultValue: false,
    };
    return patchDocsWithBoolean<IItem>(items, itemOptions, isLean);
  }

  static async chapterPatcher(
    chapters: IChapter | IChapter[]
  ): Promise<IChapter | IChapter[]> {
    const chapterOptions = {
      foreignArrayProperty: "chapters" as keyof IUser,
      foreignIdProperty: "chapterId" as keyof IUser,
      defaultValue: { watchMode: WatchMode.UNREAD },
    };
    return patchDocsWithObject<IChapter>(chapters, chapterOptions);
  }

  static async mediaPatcher(
    medias: IMedia | IMedia[]
  ): Promise<IMedia | IMedia[]> {
    const mediaOptions = {
      foreignArrayProperty: "media" as keyof IUser,
      foreignIdProperty: "mediaId" as keyof IUser,
      defaultValue: { watchMode: WatchMode.UNREAD },
    };
    return patchDocsWithObject<IMedia>(medias, mediaOptions);
  }

  // with child properties
  static async itemGroupPatcher(
    itemGroups: IItemGroup | IItemGroup[]
  ): Promise<IItemGroup | IItemGroup[]> {
    const isArray = Array.isArray(itemGroups);
    return Promise.all(
      (isArray ? itemGroups : [itemGroups]).map(
        async (itemGroup: IItemGroup) => ({
          ...(itemGroup as any),
          items: (await PatcherService.itemPatcher(
            itemGroup.items as IItem[],
            true
          )) as IItem[],
        })
      )
    );
  }

  static async paginatedItemsPatcher(
    paginatedItems: IPaginator<IItem>
  ): Promise<IPaginator<IItem>> {
    return {
      ...paginatedItems,
      data: (await PatcherService.itemPatcher(
        paginatedItems.data as IItem[],
        true
      )) as IItem[],
    };
  }

  static async lessonPatcher(
    lessons: ILesson | ILesson[]
  ): Promise<ILesson | ILesson[]> {
    const isArray = Array.isArray(lessons);
    return Promise.all(
      (isArray ? lessons : [lessons]).map(async (lesson: ILesson) => ({
        ...(lesson as any)._doc,
        chapters: (await PatcherService.chapterPatcher(
          lesson.chapters as IChapter[]
        )) as IChapter[],
      }))
    );
  }

  static async userPatcher(users: IUser | IUser[]): Promise<IUser | IUser[]> {
    const isArray = Array.isArray(users);
    return Promise.all(
      (isArray ? users : [users]).map(async (user: IUser) => ({
        ...(user as any)._doc,
        favorites: (await PatcherService.itemPatcher(
          user.favorites as IItem[]
        )) as IItem[],
        lastWatched: (await PatcherService.itemPatcher(
          user.lastWatched as IItem[]
        )) as IItem[],
      }))
    );
  }
}
