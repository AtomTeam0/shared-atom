export interface IPaginationQuery {
  skip?: number;
  limit?: number;
}

export interface IPaginator<T> {
  metadata: {
    totalDocs: number;
    page: number;
  };
  data: T[];
}

export const paginationKeys: (keyof IPaginationQuery)[] = ["skip", "limit"];
