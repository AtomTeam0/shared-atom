import { IChapter } from "./chapter.interface";
import { ITest } from "./test.interface";

export interface IPakalQuery {
  pakalId: string;
}

export interface IPakal {
  id?: string;
  chapters: string[] | IChapter[];
  test?: string | ITest;
}
