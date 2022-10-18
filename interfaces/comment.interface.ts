import { IUser } from "./user.interface";

export interface ICommentUserless {
  id?: string;
  createdAt: Date;
  comment: string;
}

export interface IComment extends ICommentUserless {
  user: string | IUser;
}
