import express from "express";
import authentication from "../../src/common/middleware/authentication";
const routes = express.Router();

routes.use('/auth', require('../../src/apis/auth/authRouter'));
routes.use('/user', require('../../src/apis/user/userRouter'));
routes.use('/friend', require('../../src/apis/profile/profileRouter'));
routes.use('/cast', require('../../src/apis/cast/castRouter'));
routes.use('/buzz', require('../../src/apis/buzz/buzzRouter'));
routes.use('/trendz', require('../../src/apis/trendz/trendzRouter'));
routes.use('/tune-in', require('../../src/apis/tuneIn/tuneInRouter'));
routes.use('/options', require('../../src/apis/others/otherRouter'));
routes.use('/notification', require('../../src/apis/notifications/notificationRouter'));
routes.use('/ikon-board', require('../../src/apis/ikonBoard/ikonBoardRouter'));
routes.use('/fcm', require('../../src/apis/fcmToken/fcmRouter'));
routes.use("/style-ikon", authentication, require("../../src/apis/styleIkon/styleIkonRouter"));
routes.use("/chat", authentication,require("../../src/apis/chat/chatRouter"));

module.exports = routes;