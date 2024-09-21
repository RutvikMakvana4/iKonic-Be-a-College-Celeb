import express from "express";

const routes = express.Router();
import authentication from "../../src/webAdmin/middleware/authentication";

routes.use("/", require("../../src/webAdmin/auth/authRouter"));
routes.use("/", require("../../src/webAdmin/dashboard/dashboardRouter"));
routes.use(
  "/quiz",
  authentication,
  require("../../src/webAdmin/quiz/quizRouter")
);

module.exports = routes;
