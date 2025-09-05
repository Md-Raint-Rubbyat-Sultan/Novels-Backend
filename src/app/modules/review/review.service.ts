import { JwtPayload } from "jsonwebtoken";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Book } from "../book/book.model";

const createReview = async (
  payload: Partial<IReview>,
  decodedToken: JwtPayload
) => {
  if (payload.writerId === decodedToken.userId) {
    throw new AppError(400, "You can't make a review on your own book.");
  }

  const newPayload = {
    ...payload,
    reviewerId: decodedToken.userId,
  };

  const session = await Review.startSession();
  session.startTransaction();

  try {
    const newReview = await Review.create([newPayload], { session });

    if (!newReview) {
      throw new AppError(400, "Faild to create review");
    }

    await Book.findByIdAndUpdate(
      newReview[0].bookid,
      { ratings: newReview[0]._id },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      data: newReview[0],
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, `Faild to create review. ${error}`);
  }
};

const getAllReviews = async (query: Record<string, string>) => {
  const qureyModel = new QueryBuilder(Review.find(), query);

  const allReviews = qureyModel.sort().paginate();

  const [data, meta] = await Promise.all([
    (await allReviews)
      .build()
      .populate("reviewerId", "name picture")
      .populate("writerId", "name picture")
      .populate("bookid"),
    qureyModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getMyReviews = async (
  query: Record<string, string>,
  decodedToken: JwtPayload
) => {
  const qureyModel = new QueryBuilder(
    Review.find({ reviewerId: decodedToken.userId }),
    query
  );

  const myReviews = qureyModel.sort().paginate();

  const [data, meta] = await Promise.all([
    (await myReviews)
      .build()
      .populate("reviewerId", "name picture")
      .populate("writerId", "name picture")
      .populate("bookid"),
    qureyModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getWriterReviews = async (
  query: Record<string, string>,
  decodedToken: JwtPayload
) => {
  const qureyModel = new QueryBuilder(
    Review.find({ writerId: decodedToken.userId }),
    query
  );

  const writerReviews = qureyModel.sort().paginate();

  const [data, meta] = await Promise.all([
    (await writerReviews)
      .build()
      .populate("reviewerId", "name picture")
      .populate("writerId", "name picture")
      .populate("bookid"),
    qureyModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const ReviewSrevice = {
  createReview,
  getAllReviews,
  getMyReviews,
  getWriterReviews,
};
