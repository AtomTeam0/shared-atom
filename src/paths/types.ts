export type Paths<
  obj extends Record<
    string,
    {
      METHOD: string;
      URL: string;
    }
  >,
> = Record<
  keyof obj,
  {
    METHOD: "get" | "post" | "put" | "delete" | "patch";
    URL: string;
  }
>;
