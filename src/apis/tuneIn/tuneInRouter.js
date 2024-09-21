import tuneInController from "./tuneInController";
import express from "express";
import asyncWrap from "express-async-wrapper";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get( "/total-students", authentication, asyncWrap(tuneInController.totalStudents));
routes.post('/create-mood', authentication, asyncWrap(tuneInController.tuneIn));
routes.get('/my-tune-in', authentication, asyncWrap(tuneInController.myTuneIn));
routes.get('/my-tune-in/views', authentication, asyncWrap(tuneInController.myTuneInViews));
routes.post('/unlock-profile/:id', authentication, asyncWrap(tuneInController.unlockProfile));
routes.get('/list', authentication, asyncWrap(tuneInController.tuneInList));
routes.get('/friend-tune-in/:id', authentication, asyncWrap(tuneInController.viewFriendTuneIn));
routes.post('/view/:id', authentication, asyncWrap(tuneInController.viewTuneIn));
routes.delete('/delete-tune-in/:id', authentication, asyncWrap(tuneInController.deleteTuneIn));

module.exports = routes;
