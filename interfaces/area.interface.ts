import { AreaNames } from "../enums/AreaNames";

export interface IArea {
  id?: string;
  name: AreaNames;
  image: string;
}

export interface ICoordinate {
  coordinateX: number;
  coordinateY: number;
}

export interface IAreaPolygon {
  area: AreaNames;
  coordinates: number[][];
}
