export interface IPaginator<T> {
  metadata: {
    totalDocs: number;
    page: number;
  };
  data: T[];
}
