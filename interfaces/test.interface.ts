export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ITest {
  questions: IQuestion[];
}
