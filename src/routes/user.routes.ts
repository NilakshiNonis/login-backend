import UserController from "../controllers/user.controller";
import { Router } from "express";
import userSchema from "../schema/user.schema";
import ValidateSchema from "../middleware/validationSchema";
import { checkAuthorization } from "../middleware/auth";
import { Role } from "../utils/enum";

export const userApisRoutes = Router();

userApisRoutes.post(
  "/login",
  ValidateSchema.prepare(userSchema.loginSchema),
  UserController.loginUser
);

userApisRoutes.post(
  "/logout",
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
  checkAuthorization([Role.ADMIN, Role.NORMAL]),
  UserController.getUser
);

userApisRoutes.get("/all", checkAuthorization(Role.NORMAL), UserController.getAllUsers)


