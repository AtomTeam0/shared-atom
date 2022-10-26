import { IUserMediaPatch } from "./user.interface";

export interface IMedia extends IUserMediaPatch {
  id?: string;
  title: string;
  description: string;
  video?: string;
  audio?: string;
}
