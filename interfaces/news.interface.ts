import { IArea } from "./area.interface";

export interface INewsQuery {
  area: string;
}

export interface INews {
  id?: string;
  createdAt: Date;
  description: string;
  area: string | IArea;
}
