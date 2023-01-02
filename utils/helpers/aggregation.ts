export const paginationPipline = (skip: number, limit: number) => [
  {
    $facet: {
      metadata: [
        { $count: "totalDocs" },
        {
          $addFields: {
            page: { $sum: [{ $floor: { $divide: [skip, limit] } }, 1] },
          },
        },
      ],
      data: [{ $skip: skip }, { $limit: limit }],
    },
  },
  {
    $addFields: {
      metadata: {
        $ifNull: [
          { $arrayElemAt: ["$metadata", 0] },
          { totalDocs: { $toInt: 0 }, page: { $toInt: 0 } },
        ],
      },
    },
  },
];
