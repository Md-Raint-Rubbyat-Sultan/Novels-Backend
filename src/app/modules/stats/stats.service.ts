import { Book } from "../book/book.model";
import { Payment_Status } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Review } from "../review/review.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const userStats = async () => {
  const totalUserPromise = User.countDocuments();
  const totalActiveUserPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInactivePromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUserLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const newUserLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const userByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUser,
    totalActiveUser,
    totalInactive,
    totalBlock,
    newUserLast7Days,
    newUserLast30Days,
    userByRole,
  ] = await Promise.all([
    totalUserPromise,
    totalActiveUserPromise,
    totalInactivePromise,
    totalBlockPromise,
    newUserLast7DaysPromise,
    newUserLast30DaysPromise,
    userByRolePromise,
  ]);

  return {
    data: {
      totalUser,
      totalActiveUser,
      totalInactive,
      totalBlock,
      newUserLast7Days,
      newUserLast30Days,
      userByRole,
    },
  };
};

const paymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();

  const totalPaymentByStatusPromise = Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Payment.aggregate([
    {
      $match: { status: Payment_Status.PAID },
    },
    {
      $group: {
        _id: null,
        count: { $sum: "$amount" },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgPaymentAMount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalPaymentByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGatewayData,
  ] = await Promise.all([
    totalPaymentPromise,
    totalPaymentByStatusPromise,
    totalRevenuePromise,
    avgPaymentAmountPromise,
    paymentGatewayDataPromise,
  ]);

  return {
    data: {
      totalPayment,
      totalPaymentByStatus,
      totalRevenue,
      avgPaymentAmount,
      paymentGatewayData,
    },
  };
};

const popularBooks = async () => {
  const popularBook = await Book.find()
    .populate("ratings")
    .sort("ratings.ratings")
    .limit(5);

  return {
    data: popularBook,
  };
};

const popularWriters = async () => {
  const topWriters = await Review.aggregate([
    {
      // Group reviews by writerId and calculate avg rating
      $group: {
        _id: "$writerId",
        avgRating: { $avg: "$ratings" },
        totalReviews: { $sum: 1 },
      },
    },
    {
      // Only keep writers with average rating > 4
      $match: {
        avgRating: { $gte: 4 },
      },
    },
    {
      // Sort highest rating first
      $sort: { avgRating: -1 },
    },
    {
      // Limit to top 5 writers
      $limit: 5,
    },
    {
      // Populate writer details from User collection
      $lookup: {
        from: "users", // collection name in MongoDB
        localField: "_id", // writerId
        foreignField: "_id", // User _id
        as: "writer",
      },
    },
    {
      // Flatten writer array
      $unwind: "$writer",
    },
    {
      // Pick only required fields
      $project: {
        _id: 0,
        writerId: "$_id",
        name: "$writer.name", // adjust based on your User schema
        picture: "$writer.picture",
        avgRating: 1,
        totalReviews: 1,
      },
    },
  ]);

  return {
    data: topWriters,
  };
};

export const StatsServices = {
  userStats,
  paymentStats,
  popularBooks,
  popularWriters,
};
