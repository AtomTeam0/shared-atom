interface IQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface ITest {
  questions: IQuestion[];
}
