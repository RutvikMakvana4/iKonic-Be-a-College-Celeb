import express from "express";
import asyncWrap from "express-async-wrapper";
import authController from "./authController";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.post('/otp-verification', asyncWrap(authController.otpVerification));
routes.post('/update-phone-otp-verify', authentication, asyncWrap(authController.updatePhoneOtpVerification));

routes.post('/resend-otp', asyncWrap(authController.resendOTP));

routes.post('/register', asyncWrap(authController.register));
routes.post('/login', asyncWrap(authController.login));
routes.post('/logout', authentication, asyncWrap(authController.logout));

routes.post('/refresh-token', asyncWrap(authController.newAccessToken));

routes.get('/interests', asyncWrap(authController.interestList));
routes.get('/sub-cultures', asyncWrap(authController.subCultureList));
routes.get('/cast-messages', asyncWrap(authController.castMessageList));

module.exports = routes;