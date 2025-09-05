import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewShema = new Schema<IReview>(
  {
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    writerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookid: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Review = model<IReview>("Review", reviewShema);
