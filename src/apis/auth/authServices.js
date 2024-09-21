import User from "../../../model/user";
import PhoneVerification from "../../../model/phoneVerification";
import FcmStore from "../../../model/fcmToken";
import Interests from "../../../model/interests";
import SubCulture from "../../../model/subCultures";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../../src/common/exceptions/errorException";
import { randomNumberGenerator, randomStringGenerator } from "../../common/helper";
import RegisterResource from "./resources/registerResource";
import AccessToken from "../../../model/accessToken";
import RefreshToken from "../../../model/refreshToken";
import jwt from "jsonwebtoken";
import { JWT } from "../../common/constants/constants";
import twilio from "twilio"
import ProfileResource from "../user/resources/profileResource";
import Followers from "../../../model/followers";
import CastMessages from "../../../model/castMessages";
import PrivacySecurity from "../../../model/privacyAndSecurity";
import PopularIkon from "../../../model/popularIkon";
import TalentedIkon from "../../../model/talentedIkon";
import TrendingCreator from "../../../model/trendingCreator";
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class authServices {

    /**
     * @description: OTP Verification
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async otpVerification(data, req, res) {
        const { type, countryCode, phone, otp } = data;

        if (type == 1) {

            const findPhoneNumber = await PhoneVerification.findOne({
                $and: [
                    { countryCode: countryCode },
                    { phone: phone }
                ]
            })

            if (findPhoneNumber) {
                if (otp == findPhoneNumber.phoneOTP) {
                    await PhoneVerification.findOneAndDelete({
                        countryCode: countryCode,
                        phone: phone
                    })

                    const findUser = await User.findOne({
                        $and: [
                            { countryCode: countryCode },
                            { phone: phone }
                        ]
                    });

                    if (findUser) {
                        const updatedUser = await User.findByIdAndUpdate(findUser._id, {
                            isVerify: true
                        }, { new: true })

                        return { ...new ProfileResource(updatedUser) }
                    }

                } else {
                    throw new BadRequestException("You entered OTP is not correct")
                }
            } else {
                throw new NotFoundException("Phone number not found")
            }
        } else if (type == 2) {

            const findPhoneNumber = await PhoneVerification.findOne({
                $and: [
                    { countryCode: countryCode },
                    { phone: phone }
                ]
            })

            if (findPhoneNumber) {
                if (otp == findPhoneNumber.phoneOTP) {
                    await PhoneVerification.findOneAndDelete({
                        countryCode: countryCode,
                        phone: phone
                    })

                    const findUser = await User.findOne({
                        $and: [
                            { countryCode: countryCode },
                            { phone: phone }
                        ]
                    });

                    return { ...new ProfileResource(findUser) }

                } else {
                    throw new BadRequestException("You entered OTP is not correct")
                }
            } else {
                throw new NotFoundException("Phone number not found")
            }
        }
    }


    /**
     * @description : Update Phone OTP Verification
     * @param {*} data 
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async updatePhoneOtpVerification(data, auth, req, res) {
        const { countryCode, phone, otp } = data;

        const findPhoneNumber = await PhoneVerification.findOne({
            $and: [
                { countryCode: countryCode },
                { phone: phone }
            ]
        })

        if (findPhoneNumber) {
            if (otp == findPhoneNumber.phoneOTP) {
                await PhoneVerification.findOneAndDelete({
                    countryCode: countryCode,
                    phone: phone
                })

                const findUser = await User.findById(auth);

                const updatedUser = await User.findByIdAndUpdate(findUser._id, { countryCode: countryCode, phone: phone, isVerify: true }, { new: true });

                return { ...new ProfileResource(updatedUser) }
            } else {
                throw new BadRequestException("You entered OTP is not correct")
            }
        } else {
            throw new NotFoundException("Phone number not found")
        }
    }


    /**
     * @description: Resend OTP
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async resendOTP(data, req, res) {
        const { countryCode, phone } = data;

        const OTP = 7777;   // await randomNumberGenerator(4);

        const sendOtpToPhone = 1;
        //     await client.messages.create({
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: `${countryCode}${phone}`,
        //     body: `Your ${process.env.APP_NAME} verification code is ${OTP}.`,
        // });

        if (sendOtpToPhone) {
            const isOtpExit = await PhoneVerification.findOne({
                countryCode: countryCode,
                phone: phone
            });

            if (isOtpExit) {
                const updateData = await PhoneVerification.findByIdAndUpdate(isOtpExit._id, {
                    countryCode: countryCode,
                    phone: phone,
                    phoneOTP: OTP
                }, { new: true });
                return updateData;
            } else {
                const createData = await PhoneVerification.create({
                    countryCode: countryCode,
                    phone: phone,
                    phoneOTP: OTP
                })
                return createData;
            }

        } else {
            throw new ConflictException("OTP not send")
        }
    }

    /**
     * @description:  User registration
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async register(data, req, res) {
        const { firstName, lastName, email, countryCode, phone } = data;

        const alreadyEmail = await User.findOne({ email: email })

        const findPhoneNumber = await User.findOne({ countryCode: countryCode, phone: phone });

        const existEmail = await User.findOne({ email: email, countryCode: countryCode, phone: phone });
        if (alreadyEmail) {
            throw new ConflictException("This email id is already in used | please try different Email Id");
        }
        else if (findPhoneNumber) {
            throw new ConflictException("Phone number already has been taken")
        }
        else if (existEmail) {
            throw new ConflictException("This users is already register | please login here")
        } else {

            const usersRegister = await User.create({
                ...data
            });

            await Followers.create({
                userId: usersRegister._id
            });

            await PrivacySecurity.create({
              userId: usersRegister._id,
              accountStatus: 1,
              manageNotifications: false,
              isParticipant: false
            });

            const OTP = 7777;       // await randomNumberGenerator(4);

            const sendOtpToPhone = 1;
            // await client.messages.create({
            // from: process.env.TWILIO_PHONE_NUMBER,
            // to: `${countryCode}${phone}`,
            // body: `Your ${process.env.APP_NAME} verification code is ${OTP}.`,
            // });

            if (sendOtpToPhone) {
                const isOtpExit = await PhoneVerification.findOne({
                    countryCode: countryCode,
                    phone: phone
                });

                if (isOtpExit) {
                    await PhoneVerification.findByIdAndUpdate(isOtpExit._id, {
                        countryCode: countryCode,
                        phone: phone,
                        phoneOTP: OTP
                    }, { new: true });
                } else {
                    await PhoneVerification.create({
                        countryCode: countryCode,
                        phone: phone,
                        phoneOTP: OTP
                    })
                }

            } else {
                throw new ConflictException("OTP not send")
            }

            // Demo table create for ikon board
            const findUserPopularIkon = await PopularIkon.findOne({ userId: usersRegister._id })
            if (!findUserPopularIkon) {
                await PopularIkon.create({
                  userId: usersRegister._id,
                });
            }        
            const findUserTalentedIkon = await TalentedIkon.findOne({ userId: usersRegister._id })
            if (!findUserTalentedIkon) {
                await TalentedIkon.create({
                  userId: usersRegister._id,
                });
            }        
            const findUserTrendingCreator = await TrendingCreator.findOne({ userId: usersRegister._id })
            if (!findUserTrendingCreator) {
                await TrendingCreator.create({
                  userId: usersRegister._id,
                });
            }

            const authentication = await authServices.generateTokenPairs(usersRegister._id);

            return { ...new RegisterResource(usersRegister), authentication };
        }
    }

    /**
     * @description: Login
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async login(data, req, res) {
        const { countryCode, phone } = data

        const findUser = await User.findOne({
            $and: [
                { countryCode: countryCode },
                { phone: phone }
            ]
        })

        if (!findUser) throw new NotFoundException("This phone number is not registered. please register first");

        const OTP = 7777; // await randomNumberGenerator(4);

        const sendOtpToPhone = 1;
        // await client.messages.create({
        // from: process.env.TWILIO_PHONE_NUMBER,
        // to: `${countryCode}${phone}`,
        // body: `Your ${process.env.APP_NAME} verification code is ${OTP}.`,
        // });

        if (sendOtpToPhone) {
            const isOtpExit = await PhoneVerification.findOne({
                countryCode: countryCode,
                phone: phone
            });

            if (isOtpExit) {
                await PhoneVerification.findByIdAndUpdate(isOtpExit._id, {
                    countryCode: countryCode,
                    phone: phone,
                    phoneOTP: OTP
                }, { new: true });
            } else {
                await PhoneVerification.create({
                    countryCode: countryCode,
                    phone: phone,
                    phoneOTP: OTP
                })
            }
        } else {
            throw new ConflictException("OTP not send")
        }

        const authentication = await authServices.generateTokenPairs(findUser._id)

        return { ...new RegisterResource(findUser), authentication }
    }

    /**
     * @description: Logout users
     * @param {*} data
     * @param {*} req 
     * @param {*} res
     */
    static async logout(data, req, res) {
        const { deviceId } = data;
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.decode(token)
        const decodedData = await JSON.parse(decodedToken.data);
        const findToken = await AccessToken.findOne({ token: decodedData.jti });
        if (!findToken) {
            throw new UnauthorizedException("This access token is expired , please login !")
        }
        await FcmStore.findOneAndDelete({ deviceId: deviceId })
        await AccessToken.findByIdAndDelete({ _id: findToken._id });
        await RefreshToken.findOneAndDelete({ accessToken: findToken.token });
        return
    }

    /**
     * @description : genearte new access token
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async newAccessToken(data, req, res) {
        const { refreshToken } = data;
        const authentication = await authServices.generateNewAccessToken(refreshToken)

        return { authentication };
    }

    /**
     * @description : Interests list
     * @param {*} req 
     * @param {*} res 
     */
    static async interestList(req, res) {
        const findInterests = await Interests.find({}).select('-__v -createdAt -updatedAt');
        return findInterests
    }

    /**
     * @description : Sub-Cultures list
     * @param {*} req 
     * @param {*} res 
     */
    static async subCultureList(req, res) {
        const findSubCultures = await SubCulture.find({}).select('-__v -createdAt -updatedAt');
        return findSubCultures
    }

    /**
     * @description : Cast messages list
     * @param {*} query
     * @param {*} req 
     * @param {*} res 
     */
    static async castMessageList(query, req, res) {
        const { type } = query;
        const findCastMessages = await CastMessages.find({ type: type }).select('-type -__v -createdAt -updatedAt');
        return findCastMessages
    }

    /**
     * @description : Generate access token & refresh token
     * @param {user} authUser : logged user data
     * @returns access & refresh token
     */
    static async generateTokenPairs(authUser) {
        const { accessToken, expiresAt } = await this.generateAccessToken(authUser)
        if (accessToken) { var refreshToken = await this.generateRefreshToken(accessToken) }
        return { accessToken, refreshToken, expiresAt }
    }

    /**
     * @description : service to generate JWT token for authentication.
     * @param {obj} user : user who wants to login.
     * @return {string}  : returns access token.
     */
    static async generateAccessToken(user) {
        const jti = randomStringGenerator()
        const data = await JSON.stringify({ user, jti });
        const accessToken = jwt.sign({ data }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
        const decodedToken = jwt.decode(accessToken)

        await AccessToken.create({
            token: jti,
            userId: user
        })
        return { accessToken, expiresAt: decodedToken.exp }
    };


    /**
     * @description : service to generate refresh token for authentication.
     * @param {string} accessToken : accessToken for refresh token.
     * @return {string}  : returns refresh token.
     */
    static async generateRefreshToken(accessToken) {
        const refreshToken = randomStringGenerator()
        const decodedToken = jwt.decode(accessToken)
        const accessJti = await JSON.parse(decodedToken.data);

        await RefreshToken.create({
            token: refreshToken,
            accessToken: accessJti.jti
        });
        return refreshToken
    };

    /**
     * @description : generate new access token
     * @param {*} refreshToken 
     */
    static async generateNewAccessToken(refreshToken) {
        const findRefreshToken = await RefreshToken.findOne({ token: refreshToken });

        if (!findRefreshToken) {
            throw new BadRequestException('Refresh token expired');
        }

        const findAccessToken = await AccessToken.findOne({ token: findRefreshToken.accessToken });

        if (!findAccessToken) {
            throw new BadRequestException('Access token expired');
        }

        const user = findAccessToken.userId;

        const deleteAccessToken = await AccessToken.findByIdAndDelete(findAccessToken._id)
        const deleteRefreshToken = await RefreshToken.findByIdAndDelete(findRefreshToken._id)

        return await this.generateTokenPairs(user)
    }
}

export default authServices;