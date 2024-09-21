import trendController from "./trendzController";
import express from "express";
import asyncWrap from "express-async-wrapper";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get('/', authentication, asyncWrap(trendController.trendz));

module.exports = routes;
