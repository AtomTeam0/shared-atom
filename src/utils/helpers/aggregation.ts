export const paginationPipline = (
  skip: number,
  limit: number,
  page: number
) => [
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
      totalDocs: 1,
      page: 1,
      data: { $slice: ["$data", skip, limit] },
    },
  },
  {
    $project: {
      metadata: {
        totalDocs: "$totalDocs",
        page: "$page",
      },
      data: 1,
    },
  },
];

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
