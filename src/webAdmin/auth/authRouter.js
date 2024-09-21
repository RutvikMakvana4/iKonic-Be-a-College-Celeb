import express from "express";
import asyncWrap from "express-async-wrapper";
import authController from "./authController";
import authentication from "../middleware/authentication";

const routes = express.Router();

routes.get("/login", asyncWrap(authController.index));
routes.post("/login", asyncWrap(authController.login));
routes.get("/logout", asyncWrap(authController.logout));

routes.get(
  "/change-password",
  authentication,
  asyncWrap(authController.changePasswordPage)
);
routes.post(
  "/change-password",
  authentication,
  asyncWrap(authController.changePassword)
);

module.exports = routes;
