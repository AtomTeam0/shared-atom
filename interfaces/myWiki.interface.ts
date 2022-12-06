import { IPaginationQuery } from "./helpers/paginator.interface";

export interface IMyWikiQuery extends IPaginationQuery {
  search: string;
}

export interface IMyWiki {
  id?: string;
  word: string;
  defenition: string;
}
