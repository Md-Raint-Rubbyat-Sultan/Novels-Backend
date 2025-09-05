import { JwtPayload } from "jsonwebtoken";
import { IBook, IBookStatusType } from "./book.interface";
import { Book } from "./book.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { bookSearchableFields } from "./book.constants";
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createBook = async (
  payload: Partial<IBook>,
  decodedToken: JwtPayload
) => {
  const newPayload: Partial<IBook> = {
    ...payload,
    authorId: decodedToken.userId,
  };

  const newBook = await Book.create(newPayload);

  return {
    data: newBook,
  };
};

const addBook = async (
  _id: string,
  payload: { bookStatus: IBookStatusType.ACCEPTED | IBookStatusType.REJECTED }
) => {
  const isBookExist = await Book.findById(_id);

  if (!isBookExist) {
    throw new AppError(404, "Book Not Found");
  }

  await Book.findByIdAndUpdate(_id, payload, { runValidators: true });

  return {
    data: {
      UpdateMessage: "Book added Successfully",
    },
  };
};

const getAllPublishedBooks = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(
    Book.find({ bookStatus: IBookStatusType.ACCEPTED }),
    query
  );

  const books = queryModel
    .search(bookSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    (await books)
      .build()
      .populate("authorId", "_id name picture")
      .populate("ratings")
      .select("-bookStatus -content"),
    queryModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getAllBooks = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(Book.find(), query);

  const books = queryModel
    .search(bookSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    (await books).build(),
    queryModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getAllPendingBooks = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(
    Book.find({ bookStatus: IBookStatusType.PENDING }),
    query
  );

  const books = queryModel
    .search(bookSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    (await books).build(),
    queryModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleBook = async (_id: string, decodedToken: JwtPayload) => {
  const userInfo = await User.findById(decodedToken.userId);

  if (userInfo && userInfo.role === Role.USER && !userInfo.subscribe) {
    throw new AppError(400, "Please subscribe to read book.");
  }

  const bookInfo = await Book.findById(_id);

  if (!bookInfo) {
    throw new AppError(404, "Book not found");
  }

  if (bookInfo.authorId.toString() !== decodedToken.userId) {
    if (userInfo && userInfo.role === Role.WRITER && !userInfo.subscribe) {
      throw new AppError(400, "Please subscribe to read book.");
    }
  }

  return {
    data: bookInfo,
  };
};

const updateBook = async (
  _id: string,
  payload: Partial<IBook>,
  decodedToken: JwtPayload
) => {
  const bookInfo = await Book.findById(_id);

  if (!bookInfo) {
    throw new AppError(404, "Book not found");
  }

  if (bookInfo.authorId.toString() !== decodedToken.userId) {
    throw new AppError(403, "You are not authorize to upadte this book.");
  }

  const session = await Book.startSession();
  session.startTransaction();

  if (!payload.bookImage) {
    const { bookImage, ...rest } = payload;
    payload = rest;
  }
  try {
    const updatedBook = await Book.findByIdAndUpdate(_id, payload, {
      runValidators: true,
    });

    if (payload.bookImage && bookInfo.bookImage) {
      await deleteImageFromCloudinary(bookInfo.bookImage);
    }

    await session.commitTransaction();
    session.endSession();

    return { data: updatedBook };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, `Faild to update book. ${error}`);
  }
};

const deleteBook = async (_id: string) => {
  const isBookExist = await Book.findById(_id);

  if (!isBookExist) {
    throw new AppError(404, "Book Not Found");
  }

  const session = await Book.startSession();
  session.startTransaction();

  try {
    const result = await Book.findByIdAndDelete(_id, { session });

    if (isBookExist.bookImage) {
      await deleteImageFromCloudinary(isBookExist.bookImage);
    }

    await session.commitTransaction();
    session.endSession();

    return {
      data: result,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, `Faild to update user. ${error}`);
  }
};

export const bookServices = {
  createBook,
  addBook,
  getAllBooks,
  getAllPublishedBooks,
  getAllPendingBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
