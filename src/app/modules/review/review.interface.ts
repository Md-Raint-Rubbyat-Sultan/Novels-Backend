import { Types } from "mongoose";

export interface IReview {
  reviewerId: Types.ObjectId;
  writerId: Types.ObjectId;
  bookid: Types.ObjectId;
  ratings: number;
  review: string;
}
