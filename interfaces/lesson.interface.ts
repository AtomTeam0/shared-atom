import { IChapter, IChapterDoc } from './chapter.interface';

export interface ILessonQuery {
    lessonId: string;
    userId: string;
}

export interface ILesson {
    id?: string;
    goal: string;
    experience: string;
    chapters: string[] | IChapter[] | IChapterDoc[];
    preKnowledge?: string[];
    test?: string;
}
