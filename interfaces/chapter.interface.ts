import { WatchMode } from "../enums/WatchMode";

export interface IChapter {
  id?: string;
  title: string;
  description?: string;
  iframe: string;
  mode?: WatchMode;
}

export interface IChapterDoc extends IChapter {
  patchUserInfo: (userId: string) => any;
}
