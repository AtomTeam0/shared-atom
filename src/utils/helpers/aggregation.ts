export const paginationPipline = (skip: number, limit: number) => [
  { $group: { _id: null, totalDocs: { $sum: 1 }, data: { $push: "$$ROOT" } } },
  { $addFields: { page: { $sum: [{ $floor: { $divide: [skip, limit] } }, 1] } } },
  { $unwind: "$data" },
  { $skip: skip },
  { $limit: limit },
  { $group: { _id: "$_id", page: { $first: "$page" }, totalDocs: { $first: "$totalDocs" }, data: { $push: "$data" } } },
];


export const isWithSearch = (pipeline: any) => {
  const firstPipe = pipeline[0];
  return (
    Object.prototype.hasOwnProperty.call(firstPipe, "$match") &&
    Object.prototype.hasOwnProperty.call(firstPipe.$match, "$text")
  );
};
