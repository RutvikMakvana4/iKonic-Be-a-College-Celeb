import express from "express";
import { baseUrl } from "../src/common/constants/configConstants";
const routes = express.Router();

routes.use("/api/v1", require("./apis/index"));

routes.use("/webAdmin", require("./webAdmin/index"));

routes.get("/changelogs", (req, res) => {
  return res.render("apis/changelogs", { layout: "apis/changelogs" });
});

routes.get("/socket-changelogs", (req, res) => {
  return res.render("apis/socket-changelogs", {
    baseUrl: baseUrl(),
    layout: "apis/socket-changelogs",
  });
});

routes.get("/chat", (req, res) => {
  return res.render("chat/");
});

module.exports = routes;
