import buzzController from "./buzzController";
import express from "express";
import asyncWrap from "express-async-wrapper";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get('/buzz-page', authentication, asyncWrap(buzzController.buzzLandingPage));
routes.post('/like-cast/:id', authentication, asyncWrap(buzzController.likeCast));
routes.post('/comment-cast/:id', authentication, asyncWrap(buzzController.commentCast));
routes.get('/comment-list', authentication, asyncWrap(buzzController.commentListing));
routes.post('/rating-cast/:id', authentication, asyncWrap(buzzController.ratingCast));
routes.get('/search-followers', authentication, asyncWrap(buzzController.searchFollowers));
routes.post('/share-cast', authentication, asyncWrap(buzzController.shareCast));
routes.post('/view-cast-count/:id', authentication, asyncWrap(buzzController.viewCast));

module.exports = routes;