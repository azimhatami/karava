const mongoose = require("mongoose");
const { ReviewModel } = require("../app/models/review");

function toIdString(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value._id) return String(value._id);
  return String(value);
}

async function getRatingStatsByUserIds(userIds) {
  const unique = [
    ...new Set((userIds || []).map(toIdString).filter(Boolean)),
  ].filter((id) => mongoose.isValidObjectId(id));

  const map = new Map();
  if (!unique.length) return map;

  const rows = await ReviewModel.aggregate([
    {
      $match: {
        reviewee: {
          $in: unique.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },
    {
      $group: {
        _id: "$reviewee",
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  for (const row of rows) {
    map.set(String(row._id), {
      totalReviews: row.totalReviews,
      averageRating: Math.round(row.averageRating * 10) / 10,
    });
  }
  return map;
}

function withRatingStats(user, statsMap) {
  if (!user) return user;
  const plain =
    typeof user.toObject === "function" ? user.toObject() : { ...user };
  const stats = statsMap.get(String(plain._id)) || {
    totalReviews: 0,
    averageRating: 0,
  };
  return {
    ...plain,
    averageRating: stats.averageRating,
    totalReviews: stats.totalReviews,
  };
}

async function attachRatingsToUsers(users) {
  const list = (users || []).filter(Boolean);
  const statsMap = await getRatingStatsByUserIds(list.map((u) => u._id));
  return list.map((user) => withRatingStats(user, statsMap));
}

module.exports = {
  toIdString,
  getRatingStatsByUserIds,
  withRatingStats,
  attachRatingsToUsers,
};
