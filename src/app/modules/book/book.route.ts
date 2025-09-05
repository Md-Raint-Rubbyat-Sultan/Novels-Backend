import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
  addBookZodSchema,
  createBookZodSchema,
  updateBookZodSchema,
} from "./book.validation";
import { bookControlers } from "./book.controle";

const router = Router();

router.post(
  "/create",
  multerUpload.single("file"),
  checkAuth(Role.WRITER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createBookZodSchema),
  bookControlers.createBook
);

router.get("/", bookControlers.getAllPublishedBooks); // all users

router.get(
  "/all-books",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookControlers.getAllBook
); // only for admin

router.get(
  "/pending-books",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookControlers.getAllPendingBooks
); // only for admin

router.patch(
  "/add-book/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(addBookZodSchema),
  bookControlers.addBook
);

router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  bookControlers.getSingleBook
);

router.patch(
  "/update-book/:id",
  multerUpload.single("file"),
  checkAuth(Role.WRITER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateBookZodSchema),
  bookControlers.updateBook
);

router.delete(
  "/delete-book/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookControlers.deleteBook
);

export const BookRouter = router;
