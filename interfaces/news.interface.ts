import { Area } from "../enums/Area";

export interface INews {
  id?: string;
  createdAt: Date;
  description: string;
  area: Area;
}
