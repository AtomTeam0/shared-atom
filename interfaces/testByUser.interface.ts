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

export interface ITestUserless {
  test: string | ITest;
  item: string | IItem;
  grade: number;
}

export interface ITestByUser extends ITestUserless {
  user: string | IUser;
}
