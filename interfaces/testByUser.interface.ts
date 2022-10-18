import { IItem } from "./item.interface";
import { ITest } from "./test.interface";
import { IUser } from "./user.interface";

export interface ITestResult {
  name: string;
  title: string;
  grade: number;
}

export interface ITestByUserQuery {
  testId?: string;
  userId?: string;
}

export interface ITestByUser {
  test: string | ITest;
  item: string | IItem;
  grade: number;
  user: string | IUser;
}

export interface ITestUserAnswers {
  test: string;
  item: string;
  answers: string[];
}
