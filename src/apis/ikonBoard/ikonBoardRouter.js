import express from "express";
import asyncWrap from "express-async-wrapper";
import ikonBoardController from "./ikonBoardController";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get('/user-ikon-details', authentication, asyncWrap(ikonBoardController.userIkonDetails));
routes.get('/user-point-summary', authentication, asyncWrap(ikonBoardController.userPointSummary));

module.exports = routes;