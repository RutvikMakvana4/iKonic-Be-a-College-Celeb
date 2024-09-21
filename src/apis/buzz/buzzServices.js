import Cast from "../../../model/cast";
import User from "../../../model/user";
import Comment from "../../../model/comments";
import BuzzResource from "./resources/buzzResource";
import CastCommentResource from "./resources/castCommentResource";
import { sendUserActionNotification, updateTrendz } from "../../common/helper";
import { NotFoundException } from "../../common/exceptions/errorException";
import Rating from "../../../model/creativeCastRatings";
import OneCastResource from "../cast/resources/oneCastResource";
import LikeResource from "./resources/likeResource";
import Followers from "../../../model/followers";
import SearchFriendsListResource from "../profile/resources/friendsListResource";
import ShareCast from "../../../model/shareCast";
import mongoose from "mongoose";
import OneCommmentResource from "./resources/OneCommentResource";
import CastViewer from "../../../model/viewerCast";
import { STATUS, TYPE } from "../../common/constants/constants";
import Notification from "../../../model/notifications";
import Trendz from "../../../model/trendz";
import PopularIkon from "../../../model/popularIkon";
import TrendingCreator from "../../../model/trendingCreator";
import TalentedIkon from "../../../model/talentedIkon";
import Chat from "../../../model/chat";

const ObjectId = mongoose.Types.ObjectId;

class buzzServices {
  /**
   * @description: Buzz landing page
   * @param {*} data
   * @param {*} auth
   * @param {*} file
   * @param {*} req
   * @param {*} res
   */
  static async buzzLandingPage(query, auth, req, res) {
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;

    try {
      const aggregationPipeline = [
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
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
      ];

      const totalData = await Cast.aggregate(aggregationPipeline);

      const checkfollowers = await Followers.findOne({
        userId: auth,
      }).populate("following");

      const myFollowers = checkfollowers.following.map(
        (following) => following._id
      );

      const viewcast = totalData.filter((cast) => {
        const isAuthUser = cast.userId.toString() === auth.toString();
        const isFollower = myFollowers.some((followerId) =>
          followerId.equals(cast.userId)
        );
        return isAuthUser || isFollower;
      });

      viewcast.sort((a, b) => b.createdAt - a.createdAt);

      const startIndex = page * pageLimit;
      const endIndex = startIndex + pageLimit;

      const paginatedViewCasts = viewcast.slice(startIndex, endIndex);

      const meta = {
        total: totalData.length,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(totalData.length / pageLimit),
      };

      return { data: new BuzzResource(paginatedViewCasts, auth), meta };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: like cast
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async likeCast(id, auth, req, res) {
    try {
      const findUser = await User.findById(auth);

      const findCast = await Cast.findById(id);

      const pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
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
      ];

      const alreadyLiked = findCast.likes.find(
        (ids) => ids.toString() === auth
      );

      if (alreadyLiked) {
        const unLike = await Cast.findByIdAndUpdate(
          findCast._id,
          { $pull: { likes: auth } },
          { new: true }
        )
          .populate("userId")
          .populate("tagFriend")
          .populate("thankYouMessage")
          .populate("shoutOutMessage")
          .populate("service")
          .populate("feedbackRequest");

        const findLatestCastUnlike = await Cast.aggregate([
          {
            $match: {
              _id: new ObjectId(unLike._id),
            },
          },
          ...pipeline,
        ]);

        const findNotification = await Notification.findOne({
          castId: findCast._id,
          userId: findCast.userId,
          status: 2,
        });

        if (findNotification) {
          await Notification.findByIdAndDelete(findNotification._id);
        }

        if (findCast.likes.length <= 2) {
          await Notification.deleteMany({
            status: STATUS.NINE,
            castId: findCast._id,
          });

          await Trendz.deleteOne({ castId: findCast._id });

          // Update numberOfTrendingCasts (ikon board)
          await TrendingCreator.findOneAndUpdate(
            { userId: findCast.userId },
            {
              $inc: { numberOfTrendingCasts: -1 },
              $inc: { totalLikes: -1 },
              $inc: { totalScore: -1 },
            },
            { new: true, upsert: true }
          );
        }

        return { ...new OneCastResource(findLatestCastUnlike[0], auth) };
      } else {
        const like = await Cast.findByIdAndUpdate(
          findCast._id,
          { $push: { likes: auth } },
          { new: true }
        )
          .populate("userId")
          .populate("tagFriend")
          .populate("thankYouMessage")
          .populate("shoutOutMessage")
          .populate("service")
          .populate("feedbackRequest");

        if (findCast.userId != auth) {
          const notificationData = {
            status: STATUS.TWO.toString(),
            auth: findCast.userId.toString(),
            friendId: auth.toString(),
            castId: findCast._id.toString(),
            userName: `${findUser.firstName} ${findUser.lastName}`,
            type: TYPE.ZERO.toString(),
          };

          sendUserActionNotification(notificationData);
          // sendUserActionNotification(2, auth, findCast.userId, findCast._id, `${findUser.firstName} ${findUser.lastName}`, 0)
        }

        const checkNotificationAppear = await Notification.findOne({
          castId: findCast._id,
          userId: findCast.userId,
          status: 9,
        });

        if (like.likes.length > 1 && like.isNominateForTrendz === true) {
          // if (!checkNotificationAppear) {

          const findTrendz = await Trendz.findOne({ castId: findCast._id });

          if (!findTrendz) {
            await Trendz.create({
              castId: findCast._id,
              userId: findCast.userId,
              totalLikes: findCast.likes.length + 1,
            });
          } else {
            await Trendz.findByIdAndUpdate(
              findTrendz._id,
              {
                totalLikes: findCast.likes.length + 1,
              },
              { new: true }
            );
          }

          const notificationData = {
            status: STATUS.NINE.toString(),
            auth: findCast.userId.toString(),
            friendId: auth.toString(),
            castId: findCast._id.toString(),
            userName: `${findUser.firstName} ${findUser.lastName}`,
            type: TYPE.ZERO.toString(),
          };

          sendUserActionNotification(notificationData);
          // }
          // sendUserActionNotification(9, auth, findCast.userId, findCast._id, `${findUser.firstName} ${findUser.lastName}`, 0)
        } else {
          await Notification.deleteMany({
            status: STATUS.NINE.toString(),
            castId: findCast._id.toString(),
          });
        }

        const findLatestCastLike = await Cast.aggregate([
          {
            $match: {
              _id: new ObjectId(like._id),
            },
          },
          ...pipeline,
        ]);

        // ikon board logic
        const findTotalTrendz = await Trendz.find({ userId: findCast.userId });

        let numberOfTrendingCasts = findTotalTrendz.length;
        let totalLikesSum = 0;

        findTotalTrendz.forEach((trend) => {
          totalLikesSum += trend.totalLikes;
        });

        let totalScore = numberOfTrendingCasts * totalLikesSum;

        await TrendingCreator.findOneAndUpdate(
          { userId: findCast.userId },
          {
            numberOfTrendingCasts: numberOfTrendingCasts,
            totalLikes: totalLikesSum,
            totalScore: totalScore,
          },
          { new: true, upsert: true }
        );

        return { ...new OneCastResource(findLatestCastLike[0], auth) };
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: Comments in cast
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async commentCast(data, id, auth, req, res) {
    const findUser = await User.findById(auth);

    const findCast = await Cast.findById(id).populate("userId");

    if (findCast) {
      const createComment = await Comment.create({
        castId: findCast._id,
        comment: data.comment,
        commentedBy: auth,
        date: new Date(),
      });

      const findComment = await Comment.findById(createComment._id).populate(
        "commentedBy"
      );

      if (findCast.userId._id != auth) {
        const notificationData = {
          status: STATUS.THREE.toString(),
          auth: findCast.userId._id.toString(),
          friendId: auth.toString(),
          castId: findCast._id.toString(),
          userName: `${findUser.firstName} ${findUser.lastName}`,
          type: TYPE.ZERO.toString(),
        };

        sendUserActionNotification(notificationData);
        // sendUserActionNotification(3, auth, findCast.userId, findCast._id, `${findUser.firstName} ${findUser.lastName}`, 0)
      }
      return { ...new OneCommmentResource(findComment) };
    } else {
      throw new NotFoundException("Cast not found");
    }
  }

  /**
   * @description: Comment listing for one cast
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async commentListing(query, auth, req, res) {
    const { castId } = query;
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;

    const findComments = await Comment.find({ castId: castId })
      .skip(page * pageLimit)
      .limit(pageLimit)
      .sort({ createdAt: -1 })
      .populate("commentedBy");

    const meta = {
      total: findComments.length,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(findComments.length / pageLimit),
    };

    return { data: new CastCommentResource(findComments), meta };
  }

  /**
   * @description: Rating Cast
   * @param {*} data
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async ratingCast(data, id, auth, req, res) {
    const findUser = await User.findById(auth);

    const findCast = await Cast.findById(id);

    if (findCast) {
      const findRatingCast = await Rating.findOne({
        castId: findCast._id,
        ratingBy: auth,
      });

      if (!findRatingCast) {
        await Rating.create({
          userId: auth,
          castId: findCast._id,
          rating: data.rating,
          ratingBy: auth,
        });
      }

      if (findCast.userId != auth) {
        const notificationData = {
          status: STATUS.FIVE.toString(),
          auth: findCast.userId.toString(),
          friendId: auth.toString(),
          castId: findCast._id.toString(),
          userName: `${findUser.firstName} ${findUser.lastName}`,
          type: TYPE.ZERO.toString(),
        };

        sendUserActionNotification(notificationData);
        // sendUserActionNotification(5, auth, findCast.userId, findCast._id, `${findUser.firstName} ${findUser.lastName}`, 0)
      }

      const findLatestCast = await Cast.aggregate([
        {
          $match: {
            _id: new ObjectId(id),
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
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
      ]);

      return { ...new OneCastResource(findLatestCast[0], auth) };
    } else {
      throw new NotFoundException("Cast not found");
    }
  }

  /**
   * @description: Search followers
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async searchFollowers(query, auth, req, res) {
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;
    const search = query.search;

    let searchQuery = {};

    if (search) {
      searchQuery = {
        $or: [
          { firstName: { $regex: ".*" + search + ".*", $options: "i" } },
          { lastName: { $regex: ".*" + search + ".*", $options: "i" } },
          { fullName: { $regex: ".*" + search + ".*", $options: "i" } },
          { collegeName: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      };
    }

    const findMyFollowers = await Followers.find({ userId: auth }).populate(
      "followers"
    );

    const myFollowers =
      findMyFollowers[0] && findMyFollowers[0].followers !== null
        ? findMyFollowers[0].followers
        : [];

    const filteredFollowers = search
      ? myFollowers.filter((follower) => {
          return (
            follower.firstName.toLowerCase().includes(search.toLowerCase()) ||
            follower.lastName.toLowerCase().includes(search.toLowerCase()) ||
            follower.fullName.toLowerCase().includes(search.toLowerCase()) ||
            follower.collegeName.toLowerCase().includes(search.toLowerCase())
          );
        })
      : myFollowers;

    // Pagination
    const startIndex = page * pageLimit;
    const endIndex = startIndex + pageLimit;
    const paginatedFollowers = filteredFollowers.slice(startIndex, endIndex);

    const meta = {
      total: paginatedFollowers.length,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(paginatedFollowers.length / pageLimit),
    };

    return { data: new SearchFriendsListResource(paginatedFollowers), meta };
  }

  /**
   * @description: Share cast to my friends
   * @param {*} data
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async shareCast(data, query, auth, req, res) {
    const castId = query.castId;

    const filterLists = [];

    const addFilter = async (field, dataArray) => {
      if (dataArray && dataArray.length > 0) {
        const newFilterArray = dataArray.map((data) => {
          return data.id;
        });
        filterLists.push(...newFilterArray);
      }
    };

    await addFilter("friends", data.friends);

    const finalQuery = [];

    if (filterLists.length) {
      finalQuery.push({
        friends: {
          $in: filterLists,
        },
      });
    }

    if (data.friends) {
      const selectedFollowers = data.friends;

      selectedFollowers.map(async (friend) => {
        await Chat.create({
          senderId: auth,
          receiverId: friend._id,
          castDetails: castId,
          type: 2,
        });
      });
    }

    if (data.isShareWithAll == true) {
      const findMyFollowers = await Followers.findOne({
        userId: auth,
      }).populate("followers");

      const allMyFriends = findMyFollowers.followers;

      allMyFriends.map(async (friend) => {
        await Chat.create({
          senderId: auth,
          receiverId: friend._id,
          castDetails: castId,
          type: 2,
        });
      });
    }
  }

  /**
   * @description: view cast count
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async viewCast(id, auth, req, res) {
    try {
      const findCast = await Cast.findById(id);

      if (!findCast) {
        throw new NotFoundException("Cast not found");
      }

      const findCastViewer = await CastViewer.findOne({
        castId: id,
        viewerId: auth,
      });

      if (!findCastViewer) {
        await CastViewer.create({
          castId: id,
          viewerId: auth,
        });
      }

      const findLatestCast = await Cast.aggregate([
        {
          $match: {
            _id: new ObjectId(id),
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
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
      ]);

      return { ...new OneCastResource(findLatestCast[0], auth) };
    } catch (error) {
      console.log(error);
    }
  }
}

export default buzzServices;
