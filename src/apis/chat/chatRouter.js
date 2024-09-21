import chatController from "./chatController";
import express from "express";
import asyncWrap from "express-async-wrapper";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get(
  "/friends-list",
  asyncWrap(chatController.chatFriendList)
);
routes.get(
  "/messages",
  asyncWrap(chatController.messageHistory)
);

module.exports = routes;
