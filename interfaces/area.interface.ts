import { AreaNames } from "../enums/AreaNames";

export interface IArea {
  id?: string;
  name: AreaNames;
  image: string;
}

export interface ICoordinate {
  coordinateX: string;
  coordinateY: string;
}

export interface IAreaPolygon {
  area: AreaNames;
  coordinates: number[][];
}
