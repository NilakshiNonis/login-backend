import UserController from "../controllers/user.controller";
import { Router } from "express";
import userSchema from "../schema/user.schema";
import ValidateSchema from "../middleware/validationSchema";
import { checkAuthorization } from "../middleware/auth";
import { Role } from "../utils/enum";

export const userApisRoutes = Router();

userApisRoutes.post(
  "/",
  ValidateSchema.prepare(userSchema.registerSchema),
  UserController.registerUser
);

userApisRoutes.post(
  "/login",
  ValidateSchema.prepare(userSchema.loginSchema),
  UserController.loginUser
);

userApisRoutes.post(
  "/logout",
  checkAuthorization([Role.ADMIN, Role.USER]),
  ValidateSchema.prepare(userSchema.refreshTokenSchema),
  UserController.logoutUser
);

userApisRoutes.post(
  "/refresh-token",
  ValidateSchema.prepare(userSchema.refreshTokenSchema),
  UserController.generateRefreshToken
);

userApisRoutes.get(
  "/me",
  checkAuthorization([Role.ADMIN, Role.USER]),
  UserController.getUser
);

userApisRoutes.get(
  "/all",
  checkAuthorization(Role.ADMIN),
  UserController.getAllUsers
);

userApisRoutes.delete(
  "/:id",
  checkAuthorization(Role.ADMIN),
  UserController.deleteUser
);

userApisRoutes.get(
  "/details/:id",
  checkAuthorization(Role.ADMIN),
  UserController.getUserDetails
);

userApisRoutes.put(
  "/:id",
  checkAuthorization(Role.ADMIN),
  ValidateSchema.prepare(userSchema.updateSchema),
  UserController.updateUser
);
