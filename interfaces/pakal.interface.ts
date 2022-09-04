import { IChapter, IChapterDoc } from "./chapter.interface";

export interface IPakalQuery {
  pakalId: string;
}

export interface IPakal {
  id?: string;
  chapters: string[] | IChapter[] | IChapterDoc[];
  preKnowledge?: string[];
  test?: string;
}
