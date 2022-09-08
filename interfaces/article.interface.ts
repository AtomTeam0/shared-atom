import { Category } from "../enums/Category";
import { IBestSoldier } from "./bestSoldier.interface";
import { IComment } from "./comment.interface";

export interface IArticle {
  id?: string;
  createdAt: Date;
  title: string;
  writenBy: string;
  pdfURL: string;
  category: Category;
  comments: string[] | IComment[];
  bestSoldier: string | IBestSoldier;
  thumbnail: string;
}
