import express from "express";
import asyncWrap from "express-async-wrapper";
import userController from "./userController";
import authentication from "../../common/middleware/authentication";
import storeFile from "../../common/middleware/storeImage";
import validator from "../../common/config/joiValidation";
import { ProfileDto } from "./dtos/profileDto";
const routes = express.Router();

routes.get('/organizations', authentication, asyncWrap(userController.organizationListing));
routes.get('/user-details', authentication, asyncWrap(userController.getUser));
routes.put('/update-user', authentication, storeFile('public/usersProfilePicture', 'profilePicture'), validator.body(ProfileDto), asyncWrap(userController.updateUser));
routes.put('/edit-profile', authentication, storeFile('public/usersProfilePicture', 'profilePicture'), asyncWrap(userController.editProfile));
routes.put('/update-phone-number', authentication, asyncWrap(userController.updatePhoneNumber));
routes.get('/user-profile-details', authentication, asyncWrap(userController.getUserProfileDetails));
routes.get('/user-memory-lane', authentication, asyncWrap(userController.userMemoryLane));
routes.get('/memory-lane-month-images', authentication, asyncWrap(userController.getMemoryLaneMonthImage));
routes.get('/profile-pic-view', authentication, asyncWrap(userController.userProfilePicView));
routes.get('/followers', authentication, asyncWrap(userController.getUsersFollowers));
routes.post('/remove-follower/:id', authentication, asyncWrap(userController.removeFollower));
routes.post('/block-user', authentication, asyncWrap(userController.blockUser));
routes.get('/block-user/list', authentication, asyncWrap(userController.blockUserList));

module.exports = routes;