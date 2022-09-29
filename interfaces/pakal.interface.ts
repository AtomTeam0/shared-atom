import { IChapter } from "./chapter.interface";
import { ITest } from "./test.interface";

export interface IPakal {
  id?: string;
  pdfURL: string;
  chapters: string[] | IChapter[];
  test?: string | ITest;
}
