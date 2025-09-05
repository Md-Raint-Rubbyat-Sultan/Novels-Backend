import { Router } from "express";
import { UserControllers } from "./user.controller";
import {
  createUserZodSchema,
  RoleChangeRequestZodSchema,
  updateRoleZodeSchema,
  updateUserZodSchema,
} from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/register",
  multerUpload.single("file"),
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser
);

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

router.get("/admins", UserControllers.getAdmins);

// role change
router.get(
  "/req-role/all-req",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllRoleChangeRequest
);

router.get(
  "/req-role/stats",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.requestRoleStats
);

router.post(
  "/req-role/request",
  checkAuth(...Object.values(Role)),
  validateRequest(RoleChangeRequestZodSchema),
  UserControllers.RoleChangeRequest
);

router.patch(
  "/req-role/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateRoleZodeSchema),
  UserControllers.updateRole
);
// end role change

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

export const UserRoutes = router;
