import { IChapter } from "./chapter.interface";
import { IItem } from "./item.interface";
import { ITest } from "./test.interface";

export interface ILessonQuery {
  lessonId: string;
}

export interface ILesson {
  id?: string;
  goal: string;
  experience: string;
  pdfURL: string;
  chapters: string[] | IChapter[];
  preKnowledge: string[] | IItem[];
  test?: string | ITest;
}
