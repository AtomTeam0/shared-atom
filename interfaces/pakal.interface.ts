import { IChapter, IChapterDoc } from "./chapter.interface";
import { ITest } from "./test.interface";

export interface IPakalQuery {
  pakalId: string;
}

export interface IPakal {
  id?: string;
  chapters: string[] | IChapter[] | IChapterDoc[];
  test?: string | ITest;
}
