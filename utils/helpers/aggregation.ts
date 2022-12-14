export const paginationPipline = (skip: number, limit: number) => [
  {
    $facet: {
      metadata: [
        { $count: "totalDocs" },
        {
          $addFields: {
            page: { $ceil: { $divide: [skip, limit] } },
          },
        },
      ],
      data: [{ $skip: skip }, { $limit: limit }],
    },
  },
  { $addFields: { metadata: { $arrayElemAt: ["$metadata", 0] } } },
];
