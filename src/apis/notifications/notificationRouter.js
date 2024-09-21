import express from "express";
import asyncWrap from "express-async-wrapper";
import notificationController from "./notificationController";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get("/history", authentication, asyncWrap(notificationController.notificationHistory))
routes.post("/readAt/:id", authentication, asyncWrap(notificationController.notificationReadAt))

routes.get('/un-read', authentication, asyncWrap(notificationController.unReadNotificationCount))

module.exports = routes;