import z from "zod";

export const createReviewZodSchema = z.object({
  writerId: z.string(),
  bookid: z.string(),
  ratings: z.number().min(0).max(5),
  review: z.string(),
});
