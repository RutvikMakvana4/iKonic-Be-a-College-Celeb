import otherController from "./otherController";
import express from "express";
import asyncWrap from "express-async-wrapper";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.post('/report-issue', authentication, asyncWrap(otherController.reportIssues));
routes.post('/feedback', authentication, asyncWrap(otherController.feedback));
routes.post('/privacy-and-security', authentication, asyncWrap(otherController.privacyAndSecurity));
routes.delete('/delete-account', authentication, asyncWrap(otherController.deleteAccount));

module.exports = routes;