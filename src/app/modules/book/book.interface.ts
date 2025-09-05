import { Types } from "mongoose";

export enum IBookTypes {
  NOVEL = "NOVEL",
  POEM = "POEM",
  SHORT_STORY = "SHORT_STORY",
  ACADECIM = "ACADECIM",
  OTHERS = "OTHERS",
}

export enum IBookLaguage {
  en = "en",
  bn = "bn",
  unknown = "unknown",
}

export enum IBookStatus {
  ONGOING = "ONGOING",
  COMPLETE = "COMPLETE",
}

export enum IBookStatusType {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface IContent {
  chapter: string;
  story: string;
}

export interface IBook {
  title: string;
  shortDescription: string;
  authorId: Types.ObjectId;
  ratings?: Types.ObjectId;
  bookType: IBookTypes;
  language: IBookLaguage;
  bookStatus: IBookStatusType;
  status: IBookStatus;
  bookmark?: string[];
  content: IContent[];
  bookImage: string;
}
