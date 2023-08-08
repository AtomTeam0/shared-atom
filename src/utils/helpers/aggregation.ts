export const paginationPipline = (skip: number, limit: number) => {
  const page = Math.floor(skip / limit);
  return [
    {
      $group: {
        _id: null,
        totalDocs: { $sum: 1 },
        data: { $push: "$$ROOT" },
      },
    },
    {
      $addFields: {
        page: { $sum: [page, 1] },
      },
    },
    {
      $project: {
        _id: 0,
        metadata: {
          totalDocs: "$totalDocs",
          page: "$page",
        },
        data: { $slice: ["$data", skip, limit] },
      },
    },
  ];
};

export const emptyPagination = {
  data: [],
  metadata: {
    totalDocs: 0,
    page: 1,
  },
};

export const isWithSearch = (pipeline: any) => {
  const firstPipe = pipeline[0];
  return (
    Object.prototype.hasOwnProperty.call(firstPipe, "$match") &&
    Object.prototype.hasOwnProperty.call(firstPipe.$match, "$text")
  );
};
