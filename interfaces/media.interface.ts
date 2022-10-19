import { IUserMediaPatch } from "./user.interface";

export interface IMedia extends IUserMediaPatch {
  id?: string;
  title: string;
  description: string;
  video?: object | string;
  audio?: object | string;
}
