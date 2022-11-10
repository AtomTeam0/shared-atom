import { AreaNames } from "../enums/AreaNames";

export interface IArea {
  id?: string;
  name: AreaNames;
  image: string;
  polygon: number[][];
}

export interface ICoordinate {
  coordinate: number[];
}
