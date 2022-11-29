export interface IMyWikiQuery {
  search: string;
  skip: string;
  limit: string;
}

export interface IMyWiki {
  id?: string;
  word: string;
  defenition: string;
}
