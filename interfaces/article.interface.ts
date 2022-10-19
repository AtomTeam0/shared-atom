import { Category } from "../enums/Category";
import { IComment } from "./comment.interface";

interface IBestSoldier {
  name: string;
  age: number;
  unit: string;
  city: string;
  description: string;
  image: string;
}

export interface IArticle {
  id?: string;
  createdAt: Date;
  title: string;
  writenBy: string;
  pdfURL: string;
  category: Category;
  comments: string[] | IComment[];
  bestSoldier: string | IBestSoldier;
  thumbnail: object | string;
}

export interface IArticleGroup {
  category: Category;
  articles: IArticle[];
}
