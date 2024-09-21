import User from "../../../model/user";
import Followers from "../../../model/followers";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../../src/common/exceptions/errorException";
import ProfileResource from "./resources/profileResource";
import axios from "axios";
import fs from "fs";
import path from "path";
import ProfileDetailsResource from "../profile/resources/profileDetailsResource";
import ProfilePictureViewResource from "../profile/resources/profilePictureViewResource";
import FollowerDetailResource from "./resources/followerDetailResource";
import SheerId from "../../../model/sheerId";
import MemoryLane from "../../../model/memoryLane";
import MemoryLaneResource from "./resources/memoryLaneResource";
import PrivacySecurity from "../../../model/privacyAndSecurity";
import BlockUser from "../../../model/blockUsers";
import PhoneVerification from "../../../model/phoneVerification";
import BlockUserListingResource from "./resources/BlockListingResource";
import mongoose from "mongoose";
import { get } from "http";
import FilterCollege from "../../../model/filterColleges";
import FollowRequest from "../../../model/followRequests";
import Season from "../../../model/season";
import Participants from "../../../model/participants";
import { baseUrl } from "../../common/constants/configConstants";
import moment from "moment";
import MemoryLaneMonthWiseResource from "./resources/memoryLaneMonthWiseResource";
import BuzzResource from "../buzz/resources/buzzResource";
import PopularIkon from "../../../model/popularIkon";

const programId = "65f125062edd076e3367504f";

const ObjectId = mongoose.Types.ObjectId;

class userServices {
  /**
   * @description: Get searching organizations list
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async organizationListing(query, auth, req, res) {
    try {
      const page = parseInt(query.page) - 1 || 0;
      const pageLimit = parseInt(query.limit) || 20;
      const search = query.search;

      let apiUrl = `https://services.sheerid.com/rest/v2/program/${programId}/organization`;

      if (search) {
        apiUrl += `?name=${search}`;
      }

      const response = await axios.get(apiUrl);

      const organizationList = response.data;

      var myFilterData = await FilterCollege.findOne({ userId: auth });

      if (myFilterData && myFilterData.collegeId.length) {
        var universityArray = [];

        let selected = [];
        var unSelected = [];

        var collegeIds = myFilterData.collegeId;
        selected.push(...collegeIds);

        for (var i = 0; i < organizationList.length; i++) {
          var currentData = organizationList[i];
          if (!collegeIds.find((college) => college.id === currentData.id)) {
            unSelected.push(currentData);
          }
        }

        var universityArray = selected.concat(unSelected);

        const startIdx = page * pageLimit;
        const endIdx = startIdx + pageLimit;
        const slicedData = universityArray.slice(startIdx, endIdx);

        const meta = {
          total: universityArray.length,
          perPage: pageLimit,
          currentPage: page + 1,
          lastPage: Math.ceil(universityArray.length / pageLimit),
        };

        return { data: slicedData, meta };
      } else {
        const startIdx = page * pageLimit;
        const endIdx = startIdx + pageLimit;
        const newData = organizationList.slice(startIdx, endIdx);

        const meta = {
          total: organizationList.length,
          perPage: pageLimit,
          currentPage: page + 1,
          lastPage: Math.ceil(organizationList.length / pageLimit),
        };

        return { data: newData, meta };
      }
    } catch (error) {
      console.error(error, "catch");
    }
  }

  /**
   * @description:  Get user data
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async getUser(auth, req, res) {
    const findUser = await User.findById({ _id: auth })
      .populate("interests")
      .populate("subCultures");
    findUser.currentSeason = await Season.findOne({ isActive: true });
    if (findUser.currentSeason) {
      const pipeline = [
        {
          $match: {
            userId: new ObjectId(findUser._id),
            seasonId: new ObjectId(findUser.currentSeason._id),
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "participantId",
            as: "LikesInfo",
          },
        },
        {
          $addFields: {
            likesCount: { $size: "$LikesInfo" }, // Calculate the count of likes
          },
        },
        {
          $project: {
            LikesInfo: 0, // Exclude LikesInfo from the output
          },
        },
      ];
      const pData = await Participants.aggregate(pipeline);

      // Current date
      const currentDate = moment();

      // Input start date and end date
      const startDate = moment(findUser.currentSeason.startDate);
      const endDate = moment(findUser.currentSeason.endDate);

      // Calculate the total duration in months between start and end date
      const totalDurationMonths = endDate.diff(startDate, "months");

      // Calculate the current round
      const currentRound = Math.max(
        1,
        Math.min(
          Math.ceil(
            currentDate.diff(startDate, "months") / (totalDurationMonths / 3)
          ),
          3
        )
      );

      findUser.currentSeason._doc.currentRound = currentRound;

      findUser.currentSeason._doc.myData =
        pData && pData.length > 0
          ? {
              collegeName: findUser.collegeName,
              firstName: findUser.firstName,
              lastName: findUser.lastName,
              likes: pData[0].likesCount,
              profile:
                pData[0].images.length > 0
                  ? baseUrl(pData[0].images[0].replace("public/", ""))
                  : null,
              // currentRound: 1,
            }
          : null;
    }
    if (!findUser) {
      throw new NotFoundException("User not found");
    } else {
      return { ...new ProfileResource(findUser) };
    }
  }

  /**
   * @description : Update user data
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async updateUser(auth, data, file, req, res) {
    console.log(data);
    // try {
    const findUser = await User.findById({ _id: auth });

    if (!findUser) {
      throw new UnauthorizedException("Unauthorized User");
    }

    if (data.interests || data.subCultures) {
      const updateData = { ...data };

      if (data.interests) {
        updateData.interests = data.interests.split(",");
      }

      if (data.subCultures) {
        updateData.subCultures = data.subCultures.split(",");
      }

      const updatedUser = await User.findByIdAndUpdate(
        findUser._id,
        updateData,
        { new: true }
      )
        .populate("interests")
        .populate("subCultures");
      return { ...new ProfileResource(updatedUser) };
    } else if (data.collegeId && data.collegeName) {
      const updatedUser = await User.findByIdAndUpdate(
        findUser._id,
        { ...data, isSheerVerified: true },
        { new: true }
      );

      // const apiUrl = `https://services.sheerid.com/rest/v2/verification/program/${programId}/step/collectStudentPersonalInfo`;

      // const payload = {
      //   firstName: updatedUser.firstName,
      //   lastName: updatedUser.lastName,
      //   birthDate: updatedUser.dateOfBirth,
      //   email: updatedUser.email,
      //   organization: {
      //     id: updatedUser.collegeId,
      //     name: updatedUser.collegeName,
      //   },
      // };

      // try {
      //   let isSheerVerified = true;
      //   const response = await axios.post(apiUrl, payload);
      //   console.log(response.data, "success");

      //   if (response.data.currentStep !== "success") {
      //     isSheerVerified = false;
      //     await User.findByIdAndUpdate(
      //       findUser._id,
      //       { isSheerVerified: false },
      //       { new: true }
      //     );
      //   } else {
      //     if (response.data.errorIds.length) {
      //       isSheerVerified = false;
      //     }
      //     await User.findByIdAndUpdate(
      //       findUser._id,
      //       { isSheerVerified },
      //       { new: true }
      //     );
      //   }

      //   const findSheerIdDetails = await SheerId.findOne({ userId: auth });

      //   if (!findSheerIdDetails) {
      //     await SheerId.create({
      //       userId: auth,
      //       verificationId: response.data.verificationId,
      //       currentStep: response.data.currentStep,
      //       errorIds: response.data.errorIds,
      //     });
      //   } else {
      //     await SheerId.findByIdAndUpdate(
      //       findSheerIdDetails._id,
      //       {
      //         verificationId: response.data.verificationId,
      //         currentStep: response.data.currentStep,
      //         errorIds: response.data.errorIds,
      //       },
      //       { new: true }
      //     );
      //   }

      //   return {
      //     ...new ProfileResource({ ...updatedUser._doc, isSheerVerified }),
      //   };
      // } catch (error) {
      //   console.log(error.response.data, "error");

      //   const findSheerIdDetails = await SheerId.findOne({ userId: auth });

      //   if (!findSheerIdDetails) {
      //     await SheerId.create({
      //       userId: auth,
      //       verificationId: error.response.data.verificationId,
      //       currentStep: error.response.data.currentStep,
      //       errorIds: error.response.data.errorIds,
      //     });
      //   } else {
      //     await SheerId.findByIdAndUpdate(
      //       findSheerIdDetails,
      //       {
      //         verificationId: error.response.data.verificationId,
      //         currentStep: error.response.data.currentStep,
      //         errorIds: error.response.data.errorIds,
      //       },
      //       { new: true }
      //     );
      //   }

      //   await User.updateOne(
      //     { _id: auth },
      //     {
      //       $set: {
      //         collegeId: null,
      //         collegeName: null,
      //       },
      //     }
      //   );

      // const updatedUser = await User.findById(auth);
      return { ...new ProfileResource(updatedUser) };
      // }
    } else if (file) {
      var profilePicture = `usersProfilePicture/${file.filename}`;
      const updatedUser = await User.findByIdAndUpdate(
        findUser._id,
        { profilePicture: profilePicture },
        { new: true }
      );
      return { ...new ProfileResource(updatedUser) };
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        findUser._id,
        { ...data },
        { new: true }
      );
      return { ...new ProfileResource(updatedUser) };
    }
    // } catch (err) {
    //     // console.log(err);
    //     res.status(500).json({ error: "An error occurred." });
    // }
  }

  /**
   * @description : User edit their profile
   * @param {*} auth
   * @param {*} data
   * @param {*} file
   * @param {*} req
   * @param {*} res
   */
  static async editProfile(auth, data, file, req, res) {
    console.log(data);
    try {
      if (file && file !== null) {
        const profilePicture = `usersProfilePicture/${file.filename}`;
        console.log("img come");

        const findUser = await User.findById(auth);

        if (findUser) {
          const updateData = { ...data, profilePicture: profilePicture };

          if (data.interests && data.interests !== "") {
            updateData.interests = data.interests.split(",");
          } else {
            updateData.interests = [];
          }

          if (data.subCultures && data.subCultures !== "") {
            updateData.subCultures = data.subCultures.split(",");
          } else {
            updateData.subCultures = [];
          }

          const updatedUser = await User.findByIdAndUpdate(auth, updateData, {
            new: true,
          })
            .populate("interests")
            .populate("subCultures");

          return { ...new ProfileResource(updatedUser) };
        } else {
          throw new BadRequestException("This user not found");
        }
      } else {
        console.log("img not come");

        const updateData = { ...data };

        if (data.interests && data.interests !== "") {
          updateData.interests = data.interests.split(",");
        } else {
          updateData.interests = [];
        }

        if (data.subCultures && data.subCultures !== "") {
          updateData.subCultures = data.subCultures.split(",");
        } else {
          updateData.subCultures = [];
        }

        const updatedUser = await User.findByIdAndUpdate(auth, updateData, {
          new: true,
        })
          .populate("interests")
          .populate("subCultures");

        return { ...new ProfileResource(updatedUser) };
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description : Update phone number
   * @param {*} data
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async updatePhoneNumber(data, auth, req, res) {
    const { countryCode, phone } = data;

    const OTP = 7777; // await randomNumberGenerator(4);

    const sendOtpToPhone = 1;
    //     await client.messages.create({
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: `${countryCode}${phone}`,
    //     body: `Your ${process.env.APP_NAME} verification code is ${OTP}.`,
    // });

    if (sendOtpToPhone) {
      const isOtpExit = await PhoneVerification.findOne({
        countryCode: countryCode,
        phone: phone,
      });

      if (isOtpExit) {
        const updateData = await PhoneVerification.findByIdAndUpdate(
          isOtpExit._id,
          {
            countryCode: countryCode,
            phone: phone,
            phoneOTP: OTP,
          },
          { new: true }
        );
        return updateData;
      } else {
        const createData = await PhoneVerification.create({
          countryCode: countryCode,
          phone: phone,
          phoneOTP: OTP,
        });
        return createData;
      }
    } else {
      throw new ConflictException("OTP not send");
    }
  }

  /**
   * @description: Get user profile details
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async getUserProfileDetails(query, auth, req, res) {
    const { type, userId, friendId } = query;

    const isUserAvailable = await User.findById(type == 1 ? userId : friendId);
    if (!isUserAvailable) {
      throw new UnauthorizedException("Unauthorized User");
    }

    const findUser = await Followers.findOne({
      userId: type == 1 ? userId : friendId,
    }).populate("userId");

    if (findUser) {
      const followersCount = findUser.followers.length;
      const followingCount = findUser.following.length;
      const thankYouCount = findUser.thankYou.length;
      const shoutOutCount = findUser.shoutOut.length;
      const ikonsCount = findUser.ikons.length;
      const secretAdmireCount = findUser.secretlyAdmire.length;

      const findProfileSetting = await PrivacySecurity.findOne({
        userId: type == 1 ? userId : friendId,
      });
      const accountStatus =
        findProfileSetting !== null ? findProfileSetting.accountStatus : "1";
      const manageNotification =
        findProfileSetting !== null
          ? findProfileSetting.manageNotifications
          : false;
      const isParticipant =
        findProfileSetting !== null ? findProfileSetting.isParticipant : false;

      const checkIsAlreadyFollowed = await Followers.findOne({
        userId: type == 1 ? userId : friendId,
      });

      if (
        checkIsAlreadyFollowed.following.includes(type == 1 ? friendId : auth)
      ) {
        var isFollowing = true;
      } else {
        var isFollowing = false;
      }

      if (
        checkIsAlreadyFollowed.followers.includes(type == 1 ? friendId : auth)
      ) {
        var isFollowed = true;
      } else {
        var isFollowed = false;
      }

      if (
        checkIsAlreadyFollowed.secretlyAdmire.includes(
          type == 1 ? friendId : auth
        )
      ) {
        var isSecretlyAdmire = true;
      } else {
        var isSecretlyAdmire = false;
      }

      const checkBlockUser = await BlockUser.findOne({
        userId: type == 1 ? friendId : auth,
        blockUserId: type == 1 ? auth : friendId,
      });

      if (checkBlockUser) {
        var isBlocked = true;
      } else {
        var isBlocked = false;
      }

      if (type == 2) {
        const checkRequestStatus = await FollowRequest.findOne({
          userId: auth,
          friendId: friendId,
        });
        if (checkRequestStatus) {
          var requestStatus = checkRequestStatus.status;
        }
      }

      return {
        ...new ProfileDetailsResource(
          findUser.userId,
          accountStatus,
          manageNotification,
          isParticipant,
          isFollowed,
          isFollowing,
          requestStatus,
          isSecretlyAdmire,
          isBlocked,
          followersCount,
          followingCount,
          thankYouCount,
          shoutOutCount,
          ikonsCount,
          secretAdmireCount
        ),
      };
    } else {
      throw new BadRequestException("Please select a valid type");
    }
  }

  /**
   * @description: Get user memory lane
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async userMemoryLane(query, auth, req, res) {
    const userId = query.userId;
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;

    try {
      const aggregationPipeline = [
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "users",
            localField: "tagFriend",
            foreignField: "_id",
            as: "friend",
          },
        },
        {
          $unwind: {
            path: "$friend",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "casts",
            localField: "castId",
            foreignField: "_id",
            as: "cast",
            pipeline: [
              {
                $lookup: {
                  from: "castmessages",
                  localField: "thankYouMessage",
                  foreignField: "_id",
                  as: "thankYouMessage",
                },
              },
              {
                $unwind: {
                  path: "$thankYouMessage",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "castmessages",
                  localField: "shoutOutMessage",
                  foreignField: "_id",
                  as: "shoutOutMessage",
                },
              },
              {
                $unwind: {
                  path: "$shoutOutMessage",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "castmessages",
                  localField: "service",
                  foreignField: "_id",
                  as: "service",
                },
              },
              {
                $unwind: {
                  path: "$service",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "castmessages",
                  localField: "feedbackRequest",
                  foreignField: "_id",
                  as: "feedbackRequest",
                },
              },
              {
                $unwind: {
                  path: "$feedbackRequest",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
        {
          $unwind: "$cast",
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            latestCast: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$latestCast" },
        },
        {
          $sort: {
            date: -1,
          },
        },
      ];

      const data = await MemoryLane.aggregate([
        ...aggregationPipeline,
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: page * pageLimit,
        },
        {
          $limit: pageLimit,
        },
      ]);

      const totalData = await MemoryLane.aggregate(aggregationPipeline);

      const meta = {
        total: totalData.length,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(totalData.length / pageLimit),
      };

      return { data: new MemoryLaneResource(data), meta };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: get memorylane all images month vise
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async getMemoryLaneMonthImage(query, auth, req, res) {
    try {
      const date = query.date;
      const userId = query.userId;
      const page = parseInt(query.page) - 1 || 0;
      const pageLimit = parseInt(query.limit) || 20;

      const currnetDate = new Date(date * 1000);
      const startDate = new Date(moment(currnetDate).startOf("month"));
      const endDate = new Date(moment(currnetDate).endOf("month"));

      const aggregationPipeline = [
        {
          $match: {
            userId: new ObjectId(userId),
            date: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "users",
            localField: "tagFriend",
            foreignField: "_id",
            as: "friend",
          },
        },
        {
          $unwind: {
            path: "$friend",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "casts",
            localField: "castId",
            foreignField: "_id",
            as: "cast",
            pipeline: [
              {
                $lookup: {
                  from: "castmessages",
                  localField: "thankYouMessage",
                  foreignField: "_id",
                  as: "thankYouMessage",
                },
              },
              {
                $unwind: {
                  path: "$thankYouMessage",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "castmessages",
                  localField: "shoutOutMessage",
                  foreignField: "_id",
                  as: "shoutOutMessage",
                },
              },
              {
                $unwind: {
                  path: "$shoutOutMessage",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "castmessages",
                  localField: "service",
                  foreignField: "_id",
                  as: "service",
                },
              },
              {
                $unwind: {
                  path: "$service",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "castmessages",
                  localField: "feedbackRequest",
                  foreignField: "_id",
                  as: "feedbackRequest",
                },
              },
              {
                $unwind: {
                  path: "$feedbackRequest",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "ratings",
                  localField: "_id",
                  foreignField: "castId",
                  as: "ratingDetails",
                },
              },
              {
                $lookup: {
                  from: "castviewers",
                  localField: "_id",
                  foreignField: "castId",
                  as: "castviewers",
                },
              },
              {
                $lookup: {
                  from: "comments",
                  localField: "_id",
                  foreignField: "castId",
                  as: "comments",
                },
              },
              {
                $addFields: {
                  commentsCount: { $size: "$comments" },
                },
              },
              {
                $project: {
                  comments: 0,
                },
              },
            ],
          },
        },
        {
          $unwind: "$cast",
        },
      ];

      const data = await MemoryLane.aggregate([
        ...aggregationPipeline,
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: page * pageLimit,
        },
        {
          $limit: pageLimit,
        },
      ]);

      const totalData = await MemoryLane.aggregate(aggregationPipeline);

      const meta = {
        total: totalData.length,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(totalData.length / pageLimit),
      };

      return { data: new MemoryLaneMonthWiseResource(data, auth), meta };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: User profile picture view
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async userProfilePicView(query, auth, req, res) {
    const { type, userId, friendId } = query;

    let user;
    if (type == 1) {
      user = await User.findById(userId)
        .populate("interests")
        .populate("subCultures");
    } else if (type == 2) {
      user = await User.findById(friendId)
        .populate("interests")
        .populate("subCultures");
    } else {
      throw new BadRequestException("Please select a valid type");
    }

    return { ...new ProfilePictureViewResource(user) };
  }

  /**
   * @description: Get users all followers list
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async getUsersFollowers(query, auth, req, res) {
    try {
      const page = parseInt(query.page) - 1 || 0;
      const pageLimit = parseInt(query.limit) || 20;
      const { userType, type, userId, friendId } = query;

      if (userType == 1) {
        // var userProfileData = await Followers.findOne({ userId: userId }).populate("followers").populate("following").populate("thankYou").populate("shoutOut").populate("secretlyAdmire");

        const userProfileData = await Followers.findOne({
          userId: userId,
        })
          .populate("followers")
          .populate("following")
          .populate("thankYou")
          .populate("shoutOut")
          .populate("secretlyAdmire");

        const getmyBlockUsers = await BlockUser.distinct("blockUserId", {
          userId: auth,
        });
        const blockedUserIds = getmyBlockUsers.map((user) =>
          user._id.toString()
        );

        if (type == 1) {
          const filteredFollowers = userProfileData.followers.filter(
            (follower) => {
              const followerId = follower._id.toString();
              return !blockedUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredFollowers.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredFollowers.length / pageLimit),
          };

          return { data: new FollowerDetailResource(filteredFollowers), meta };
        } else if (type == 2) {
          const filteredFollowing = userProfileData.following.filter(
            (following) => {
              const followerId = following._id.toString();
              return !blockedUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredFollowing.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredFollowing.length / pageLimit),
          };
          return { data: new FollowerDetailResource(filteredFollowing), meta };
        } else if (type == 3) {
          const filteredThankYou = userProfileData.thankYou.filter(
            (thankYou) => {
              const followerId = thankYou._id.toString();
              return !blockedUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredThankYou.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredThankYou.length / pageLimit),
          };
          return { data: new FollowerDetailResource(filteredThankYou), meta };
        } else if (type == 4) {
          const filteredShoutOut = userProfileData.shoutOut.filter(
            (shoutOut) => {
              const followerId = shoutOut._id.toString();
              return !blockedUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredShoutOut.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredShoutOut.length / pageLimit),
          };

          return { data: new FollowerDetailResource(filteredShoutOut), meta };
        } else if (type == 5) {
          const filteredSecretlyAdmire = userProfileData.secretlyAdmire.filter(
            (secretlyAdmire) => {
              const followerId = secretlyAdmire._id.toString();
              return !blockedUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredSecretlyAdmire.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredSecretlyAdmire.length / pageLimit),
          };

          return {
            data: new FollowerDetailResource(filteredSecretlyAdmire),
            meta,
          };
        } else {
          throw new BadRequestException("Please enter valid type");
        }
      } else if (userType == 2) {
        // var friendProfileData = await Followers.findOne({ userId: friendId }).populate("followers").populate("following").populate("thankYou").populate("shoutOut");

        const getmyBlockUsers = await BlockUser.distinct("blockUserId", {
          userId: auth,
        });
        const blockMeUser = await BlockUser.find({
          blockUserId: auth,
        }).distinct("userId");

        const friendProfileData = await Followers.findOne({
          userId: friendId,
        })
          .populate("followers")
          .populate("following")
          .populate("thankYou")
          .populate("shoutOut")
          .populate("secretlyAdmire");

        const blockedUserIds = getmyBlockUsers.map((user) =>
          user._id.toString()
        );
        const blockMeUserIds = blockMeUser.map((user) => user._id.toString());

        const bothBlockUserIds = blockedUserIds.concat(blockMeUserIds);

        if (type == 1) {
          const filteredFollowers = friendProfileData.followers.filter(
            (follower) => {
              const followerId = follower._id.toString();
              return !bothBlockUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredFollowers.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredFollowers.length / pageLimit),
          };

          return { data: new FollowerDetailResource(filteredFollowers), meta };
        } else if (type == 2) {
          const filteredFollowing = friendProfileData.following.filter(
            (following) => {
              const followerId = following._id.toString();
              return !bothBlockUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredFollowing.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredFollowing.length / pageLimit),
          };

          return { data: new FollowerDetailResource(filteredFollowing), meta };
        } else if (type == 3) {
          const filteredThankYou = friendProfileData.thankYou.filter(
            (thankYou) => {
              const followerId = thankYou._id.toString();
              return !bothBlockUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredThankYou.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredThankYou.length / pageLimit),
          };

          return { data: new FollowerDetailResource(filteredThankYou), meta };
        } else if (type == 4) {
          const filteredShoutOut = friendProfileData.shoutOut.filter(
            (shoutOut) => {
              const followerId = shoutOut._id.toString();
              return !bothBlockUserIds.includes(followerId);
            }
          );

          const meta = {
            total: filteredShoutOut.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredShoutOut.length / pageLimit),
          };
          return { data: new FollowerDetailResource(filteredShoutOut), meta };
        } else if (type == 5) {
          const filteredSecretlyAdmire =
            friendProfileData.secretlyAdmire.filter((secretlyAdmire) => {
              const followerId = secretlyAdmire._id.toString();
              return !bothBlockUserIds.includes(followerId);
            });

          const meta = {
            total: filteredSecretlyAdmire.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(filteredSecretlyAdmire.length / pageLimit),
          };

          return {
            data: new FollowerDetailResource(filteredSecretlyAdmire),
            meta,
          };
        } else {
          throw new BadRequestException("Please enter valid type");
        }
      } else {
        throw new BadRequestException("Please enter valid userType");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: Remove user follower
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async removeFollower(id, auth, req, res) {
    const findUser = await Followers.findOne({ userId: auth });

    const checkFollower = findUser.followers.find(
      (ids) => ids.toString() === id
    );
    if (checkFollower) {
      await Followers.findByIdAndUpdate(
        findUser._id,
        { $pull: { followers: id } },
        { new: true }
      );
    } else {
      throw new NotFoundException(
        "This follower is not found in your follower list"
      );
    }

    const findFriend = await Followers.findOne({ userId: id });

    const checkFollowing = findFriend.following.find(
      (ids) => ids.toString() === auth
    );
    if (checkFollowing) {
      await Followers.findByIdAndUpdate(
        findFriend._id,
        { $pull: { following: auth } },
        { new: true }
      );
    }

    const findFriendRequests = await FollowRequest.findOne({
      userId: id,
      friendId: auth,
    });

    if (!findFriendRequests) {
      await FollowRequest.create({
        userId: id,
        friendId: auth,
        status: 0,
      });
    } else {
      await FollowRequest.findByIdAndUpdate(
        findFriendRequests._id,
        { status: 0 },
        { new: true }
      );
    }

    // Update numberOfFollowers (ikon board)
    await PopularIkon.findOneAndUpdate(
      { userId: auth },
      { $inc: { numberOfFollowers: -1, totalScore: -1 } },
      { new: true, upsert: true }
    );
  }

  /**
   * @description: Block user
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async blockUser(query, auth, req, res) {
    const { type, friendId } = query;

    if (type == 1) {
      const findBlockUser = await BlockUser.findOne({
        userId: auth,
        blockUserId: friendId,
      });

      if (!findBlockUser) {
        await BlockUser.create({
          userId: auth,
          blockUserId: friendId,
        });

        await Followers.findOneAndUpdate(
          { userId: auth },
          {
            $pull: { followers: friendId, following: friendId },
          },
          { new: true }
        );

        await Followers.findOneAndUpdate(
          { userId: friendId },
          {
            $pull: { followers: auth, following: auth },
          },
          { new: true }
        );
      } else {
        return res.status(200).json({ message: "User already blocked." });
      }

      return res.status(200).json({ message: "User Blocked successfully." });
    } else if (type == 2) {
      const findBlockUser = await BlockUser.findOne({
        userId: auth,
        blockUserId: friendId,
      });

      await BlockUser.findByIdAndDelete(findBlockUser);
      return res.status(200).json({ message: "User Unblocked successfully" });
    }
  }

  /**
   * @description: Block user listing
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async blockUserList(query, auth, req, res) {
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;

    const findBlockUsers = await BlockUser.find({ userId: auth })
      .skip(page * pageLimit)
      .limit(pageLimit)
      .sort({ createdAt: -1 })
      .populate("blockUserId");

    const meta = {
      total: findBlockUsers.length,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(findBlockUsers.length / pageLimit),
    };

    if (!findBlockUsers) {
      throw new NotFoundException("Block list is empty.");
    } else {
      return { data: new BlockUserListingResource(findBlockUsers), meta };
    }
  }
}

export default userServices;
