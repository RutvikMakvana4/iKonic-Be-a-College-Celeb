import express from "express";
import asyncWrap from "express-async-wrapper";
import quizController from "./quizController";
import storeFile from "../../common/middleware/storeImage";

const routes = express.Router();

routes.get("/add-quiz", asyncWrap(quizController.addQuizPage));
routes.post(
  "/add-quiz",
  storeFile("public/quizImages", "image", "single"),
  asyncWrap(quizController.addQuiz)
);

module.exports = routes;
