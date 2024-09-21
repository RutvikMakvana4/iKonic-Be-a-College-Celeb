import express from "express";
import asyncWrap from "express-async-wrapper";
import profileController from "./profileController";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.post('/search-friends', authentication, asyncWrap(profileController.searchFriends));
routes.post('/follow-friend', authentication, asyncWrap(profileController.followFriends));

routes.post('/follow-request', authentication, asyncWrap(profileController.confirmFollowRequest));

routes.get('/followers/:id', authentication, asyncWrap(profileController.getFollowers));
routes.post('/secretly-admire/:id', authentication, asyncWrap(profileController.secretlyAdmire));

routes.get('/suggested-friends', authentication, asyncWrap(profileController.suggestedFriends))

module.exports = routes;