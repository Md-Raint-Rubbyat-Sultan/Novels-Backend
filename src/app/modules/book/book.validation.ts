import z from "zod";
import {
  IBookLaguage,
  IBookStatus,
  IBookStatusType,
  IBookTypes,
} from "./book.interface";

export const createBookZodSchema = z.object({
  title: z.string().min(1, { message: "Title too short." }),
  content: z.array(z.object({ chapter: z.string(), story: z.string() })),
  shortDescription: z.string().optional(),
  bookType: z
    .enum(Object.values(IBookTypes) as [string, ...string[]])
    .optional(),
  language: z
    .enum(Object.values(IBookLaguage) as [string, ...string[]])
    .optional(),
  status: z
    .enum(Object.values(IBookStatus) as [string, ...string[]])
    .optional(),
});

export const addBookZodSchema = z.object({
  bookStatus: z.enum([IBookStatusType.ACCEPTED, IBookStatusType.REJECTED]),
});

export const updateBookZodSchema = z.object({
  title: z.string().min(1, { message: "Title too short." }).optional(),
  content: z
    .array(z.object({ chapter: z.string(), story: z.string() }))
    .optional(),
  shortDescription: z.string().optional(),
  bookType: z
    .enum(Object.values(IBookTypes) as [string, ...string[]])
    .optional(),
  language: z
    .enum(Object.values(IBookLaguage) as [string, ...string[]])
    .optional(),
  status: z
    .enum(Object.values(IBookStatus) as [string, ...string[]])
    .optional(),
  ratings: z.string().optional(),
});
