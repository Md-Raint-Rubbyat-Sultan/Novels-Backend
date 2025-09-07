import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { bookServices } from "./book.service";

const createBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookInfo = {
      ...req.body,
      bookImage: (req.file?.path as string) || "",
    };
    const decodedToken = req.user as JwtPayload;

    const result = await bookServices.createBook(bookInfo, decodedToken);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Book created",
      data: result.data,
    });
  }
);

const addBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params?.id;
    const payload = req.body;

    const result = await bookServices.addBook(_id, payload);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Book Added",
      data: result.data,
    });
  }
);

const getAllPublishedBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const result = await bookServices.getAllPublishedBooks(query);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Books retrives",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getMyBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const decodedToken = req.user as JwtPayload;

    const result = await bookServices.getMyBooks(query, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Books retrives",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getAllBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const result = await bookServices.getAllBooks(query);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Books retrives",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getAllPendingBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const result = await bookServices.getAllPendingBooks(query);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Pending Books retrives",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params?.id;
    const decodedToken = req.user as JwtPayload;

    const result = await bookServices.getSingleBook(_id, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Pending Books retrives",
      data: result.data,
    });
  }
);

const updateBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookInfo = {
      ...req.body,
      bookImage: (req.file?.path as string) || "",
    };
    const _id = req.params?.id;
    const decodedToken = req.user as JwtPayload;

    const result = await bookServices.updateBook(_id, bookInfo, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Pending Books retrives",
      data: result.data,
    });
  }
);

const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    const result = await bookServices.deleteBook(_id);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Book created",
      data: result.data,
    });
  }
);

export const bookControlers = {
  createBook,
  addBook,
  getAllBook,
  getMyBooks,
  getAllPublishedBooks,
  getAllPendingBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
