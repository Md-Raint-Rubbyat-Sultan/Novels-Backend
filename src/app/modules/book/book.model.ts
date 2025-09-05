import { model, Schema } from "mongoose";
import {
  IBook,
  IBookLaguage,
  IBookStatus,
  IBookStatusType,
  IBookTypes,
  IContent,
} from "./book.interface";

const contentSchema = new Schema<IContent>(
  {
    chapter: { type: String, required: true, trim: true },
    story: { type: String, required: true, trim: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "N/A",
    },
    bookStatus: {
      type: String,
      enum: Object.values(IBookStatusType),
      default: IBookStatusType.PENDING,
    },
    status: {
      type: String,
      enum: Object.values(IBookStatus),
      default: IBookStatus.COMPLETE,
    },
    language: {
      type: String,
      enum: Object.values(IBookLaguage),
      default: IBookLaguage.unknown,
    },
    bookType: {
      type: String,
      enum: Object.values(IBookTypes),
      default: IBookTypes.OTHERS,
    },
    ratings: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: [contentSchema],
      required: true,
    },
    bookmark: { type: [String], default: [] },
    bookImage: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Book = model<IBook>("Book", bookSchema);
