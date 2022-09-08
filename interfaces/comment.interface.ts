import { IUser } from "./user.interface";

export interface IComment {
  id?: string;
  createdAt: Date;
  comment: string;
  userId: string | IUser;
}
