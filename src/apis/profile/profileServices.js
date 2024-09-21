import User from "../../../model/user";
import SearchFriendsListResource from "./resources/friendsListResource";
import ProfileDetailsResource from "./resources/profileDetailsResource";
import ProfilePictureViewResource from "./resources/profilePictureViewResource";
import Followers from "../../../model/followers";
import {
  BadRequestException,
  NotFoundException,
} from "../../../src/common/exceptions/errorException";
import BlockUser from "../../../model/blockUsers";
import { sendUserActionNotification } from "../../common/helper";
import FilterCollege from "../../../model/filterColleges";
import FollowRequest from "../../../model/followRequests";
import PrivacySecurity from "../../../model/privacyAndSecurity";
import Notification from "../../../model/notifications";
import OneNotificationResource from "../notifications/resources/oneNotificationResource";
import { STATUS, TYPE } from "../../common/constants/constants";
import PopularIkon from "../../../model/popularIkon";
import SuggestedFriendsListResource from "./resources/suggestedFriendsResource";

class profileServices {
  /**
   * @description: Search Friends
   * @param {*} query
   * @param {*} data
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async searchFriends(query, data, auth, req, res) {
    console.log(data);
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;
    const search = query.search;

    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: ".*" + search + ".*", $options: "i" } },
            { lastName: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullName: { $regex: ".*" + search + ".*", $options: "i" } },
            { collegeName: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        }
      : {};

    const filterLists = [];

    const addFilter = async (field, dataArray) => {
      if (dataArray && dataArray.length > 0) {
        const findUserFilter = await FilterCollege.findOne({ userId: auth });

        if (!findUserFilter) {
          await FilterCollege.create({
            userId: auth,
            collegeId: dataArray,
          });
        } else {
          await FilterCollege.findByIdAndUpdate(
            findUserFilter._id,
            {
              collegeId: dataArray,
            },
            { new: true }
          );
        }

        const newFilterArray = dataArray.map((data) => {
          return data.id;
        });
        console.log(newFilterArray, "new");
        filterLists.push(...newFilterArray);
      } else {
        await FilterCollege.deleteMany({ userId: auth });
      }
    };

    console.log(filterLists, "filterlist");

    await addFilter("collegeId", data.collegeId);

    const blockedUserIds = await BlockUser.find({ userId: auth }).distinct(
      "blockUserId"
    );
    const blockMe = await BlockUser.find({ blockUserId: auth }).distinct(
      "userId"
    );

    const excludeBlockedUsers = {
      _id: { $nin: blockedUserIds.concat(blockMe) },
    };

    const finalQuery = [
      searchQuery,
      excludeBlockedUsers,
      { isSheerVerified: true },
      { _id: { $ne: auth } },
    ];

    if (filterLists.length) {
      finalQuery.push({
        collegeId: {
          $in: filterLists,
        },
      });
    }

    console.log(finalQuery, "final");

    const filteredFriends = await User.find({ $and: finalQuery })
      .skip(page * pageLimit)
      .limit(pageLimit);

    const meta = {
      total: filteredFriends.length,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(filteredFriends.length / pageLimit),
    };

    return { data: new SearchFriendsListResource(filteredFriends), meta };
  }

  /**
   * @description: Follow Friends
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async followFriends(query, auth, req, res) {
    const { type, friendId } = query;

    if (type == 1) {
      const findUser = await User.findById(auth);

      const findFriend = await User.findById(friendId);

      if (!findFriend) {
        throw new NotFoundException("Friend not found");
      }

      const friendAccountStatus = await PrivacySecurity.findOne({
        userId: friendId,
      });

      if (friendAccountStatus.accountStatus === "1") {
        console.log("1");
        const myFollowers = await Followers.findOne({ userId: auth });

        if (myFollowers) {
          if (!myFollowers.following.includes(friendId)) {
            await Followers.findByIdAndUpdate(
              myFollowers._id,
              { $push: { following: friendId } },
              { new: true }
            );
          }

          const otherFollowers = await Followers.findOne({ userId: friendId });

          if (!otherFollowers.followers.includes(auth)) {
            await Followers.findByIdAndUpdate(
              otherFollowers._id,
              { $push: { followers: auth } },
              { new: true }
            );
          }

          const findFriendRequests = await FollowRequest.findOne({
            userId: auth,
            friendId: friendId,
          });

          let userRequest;

          if (!findFriendRequests) {
            userRequest = await FollowRequest.create({
              userId: auth,
              friendId: friendId,
              status: 2,
            });
          } else {
            userRequest = await FollowRequest.findByIdAndUpdate(
              findFriendRequests._id,
              { status: 2 },
              { new: true }
            );
          }

          const notificationData = {
            status: STATUS.ONE.toString(),
            auth: friendId.toString(),
            friendId: auth.toString(),
            userName: `${findUser.firstName} ${findUser.lastName}`,
            type: TYPE.ZERO.toString(),
          };

          console.log({ notificationData });

          sendUserActionNotification(notificationData);
          // sendUserActionNotification(1, auth, friendId, null, `${findUser.firstName} ${findUser.lastName}`)

          // Update numberOfFollowers (ikon board)
          await PopularIkon.findOneAndUpdate(
            { userId: friendId },
            { $inc: { numberOfFollowers: 1, totalScore: 1 } },
            { new: true, upsert: true }
          );

          return res.status(200).json({
            message: "Successfully followed the user",
            data: { requestStatus: userRequest.status },
          });
        }
      } else {
        console.log("2");

        const findFriendRequests = await FollowRequest.findOne({
          userId: auth,
          friendId: friendId,
        });

        let userRequest;

        if (!findFriendRequests) {
          userRequest = await FollowRequest.create({
            userId: auth,
            friendId: friendId,
            status: 1,
          });
        } else {
          userRequest = await FollowRequest.findByIdAndUpdate(
            findFriendRequests._id,
            { status: 1 },
            { new: true }
          );
        }

        const notificationData = {
          status: STATUS.EIGHT.toString(),
          auth: friendId.toString(),
          friendId: auth.toString(),
          userName: `${findUser.firstName} ${findUser.lastName}`,
          type: TYPE.ONE.toString(),
        };

        sendUserActionNotification(notificationData);
        // sendUserActionNotification(8, auth, friendId, null, `${findUser.firstName} ${findUser.lastName}`, 1)

        return res.status(200).json({
          message: "Successfully sent requested to the user",
          data: { requestStatus: userRequest.status },
        });
      }
    } else if (type == 2) {
      const findUser = await Followers.findOne({ userId: auth });
      const findFriend = await Followers.findOne({ userId: friendId });

      const checkFollowing = findUser.following.find(
        (ids) => ids.toString() === friendId
      );

      if (checkFollowing) {
        await Followers.findByIdAndUpdate(
          findUser._id,
          { $pull: { following: friendId } },
          { new: true }
        );
        await Followers.findByIdAndUpdate(
          findFriend._id,
          { $pull: { followers: auth } },
          { new: true }
        );
      }

      let userRequest;
      const findFriendRequests = await FollowRequest.findOne({
        userId: auth,
        friendId: friendId,
      });

      if (!findFriendRequests) {
        userRequest = await FollowRequest.create({
          userId: auth,
          friendId: friendId,
          status: 0,
        });
      } else {
        userRequest = await FollowRequest.findByIdAndUpdate(
          findFriendRequests._id,
          { status: 0 },
          { new: true }
        );
      }

      const findRequestNotification = await Notification.findOne({
        userId: friendId,
        friendId: auth,
        status: 8,
      });
      if (findRequestNotification) {
        await Notification.findByIdAndDelete(findRequestNotification._id);
      }

      // Update numberOfFollowers (ikon board)
      await PopularIkon.findOneAndUpdate(
        { userId: friendId },
        { $inc: { numberOfFollowers: -1, totalScore: -1 } },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        message: "Remove follower successfully",
        data: { requestStatus: userRequest.status },
      });
    } else {
      throw new BadRequestException("Please enter valid type");
    }
  }

  /**
   * @description: Confirm follow requests
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async confirmFollowRequest(query, auth, req, res) {
    const type = query.type;
    const friendId = query.friendId;

    const findUser = await User.findById(auth);

    const findfriend = await User.findById(friendId);
    if (!findfriend) {
      throw new NotFoundException("Friend not found");
    }

    if (type == 1) {
      const findFollowRequest = await FollowRequest.findOne({
        userId: friendId,
        friendId: auth,
      });

      if (findFollowRequest) {
        await FollowRequest.findByIdAndUpdate(
          findFollowRequest._id,
          { status: 2 },
          { new: true }
        );
      }

      const findRequestNotification = await Notification.findOne({
        userId: auth,
        friendId: friendId,
        type: 1,
      });
      if (findRequestNotification) {
        var updateNotification = await Notification.findByIdAndUpdate(
          findRequestNotification._id,
          { type: 2, description: "Request has been accepted" },
          { new: true }
        ).populate("friendId");
      }

      const myFollowers = await Followers.findOne({ userId: auth });
      await Followers.findByIdAndUpdate(
        myFollowers._id,
        { $push: { followers: friendId } },
        { new: true }
      );

      const friendFollowers = await Followers.findOne({ userId: friendId });
      await Followers.findByIdAndUpdate(
        friendFollowers._id,
        { $push: { following: auth } },
        { new: true }
      );

      const notificationData = {
        status: STATUS.TEN.toString(),
        auth: friendId.toString(),
        friendId: auth.toString(),
        userName: `${findUser.firstName} ${findUser.lastName}`,
        type: TYPE.ZERO.toString(),
      };

      sendUserActionNotification(notificationData);

      // Update numberOfFollowers (ikon board)
      await PopularIkon.findOneAndUpdate(
        { userId: auth },
        { $inc: { numberOfFollowers: 1, totalScore: 1 } },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        message: "Confirm request successfully.",
        data: new OneNotificationResource(updateNotification),
      });
    } else if (type == 2) {
      // const findFollowRequest = await FollowRequest.findOne({ userId: friendId })
      // if (findFollowRequest) {
      //     await FollowRequest.findByIdAndDelete(findFollowRequest._id)
      // }

      const findFriendRequests = await FollowRequest.findOne({
        userId: friendId,
        friendId: auth,
      });

      if (!findFriendRequests) {
        await FollowRequest.create({
          userId: friendId,
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

      const findRequestNotification = await Notification.findOne({
        userId: auth,
        friendId: friendId,
        status: 8,
      });
      if (findRequestNotification) {
        await Notification.findByIdAndDelete(findRequestNotification._id);
      }

      return res.status(200).json({ message: "Deleted request successfully." });
    } else {
      throw new BadRequestException("Please select valid type");
    }
  }

  /**
   * @description: Get all followers list
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async getFollowers(id, auth, req, res) {
    try {
      const followersList = await Followers.find({ userId: id })
        .populate("followers")
        .populate("following");
      return followersList;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: Secretly Admire
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async secretlyAdmire(id, auth, req, res) {
    try {
      const findUser = await User.findById(auth);

      const findFriend = await User.findById(id);
      if (findFriend) {
        const friend = await Followers.findOne({ userId: id });

        if (friend) {
          if (!friend.secretlyAdmire.includes(auth)) {
            await Followers.findOneAndUpdate(
              { userId: id },
              { $push: { secretlyAdmire: auth } },
              { new: true }
            );

            const notificationData = {
              status: STATUS.FOUR.toString(),
              auth: id.toString(),
              friendId: auth.toString(),
              userName: `${findUser.firstName} ${findUser.lastName}`,
              type: TYPE.ZERO.toString(),
            };

            sendUserActionNotification(notificationData);
            // sendUserActionNotification(4, auth, id, null, `${findUser.firstName} ${findUser.lastName}`)

            // Update numberOfSecretlyAdmirers for the admired user (ikon board)
            await PopularIkon.findOneAndUpdate(
              { userId: id },
              { $inc: { numberOfSecretAdmirers: 1, totalScore: 1 } },
              { new: true, upsert: true }
            );

            return res
              .status(200)
              .json({ message: "You are now secretly admire" });
          } else {
            await Followers.findOneAndUpdate(
              { userId: id },
              { $pull: { secretlyAdmire: auth } },
              { new: true }
            );

            const findNotification = await Notification.findOne({
              userId: id,
              friendId: auth,
              status: 4,
            });

            if (findNotification) {
              await Notification.findByIdAndDelete(findNotification._id);
            }

            // Update numberOfSecretlyAdmirers for the admired user (ikon board)
            await PopularIkon.findOneAndUpdate(
              { userId: id },
              { $inc: { numberOfSecretAdmirers: -1, totalScore: -1 } },
              { new: true }
            );

            return res
              .status(200)
              .json({ message: "Remove secretly admire successfully" });
          }
        } else {
          await Followers.create({
            userId: id,
            secretlyAdmire: [auth],
          });

          const notificationData = {
            status: STATUS.FOUR.toString(),
            auth: id.toString(),
            friendId: auth.toString(),
            userName: `${findUser.firstName} ${findUser.lastName}`,
            type: TYPE.ZERO.toString(),
          };

          sendUserActionNotification(notificationData);
          // sendUserActionNotification(4, auth, id, null, `${findUser.firstName} ${findUser.lastName}`)

          // Update numberOfSecretlyAdmirers (ikon board)
          await PopularIkon.findOneAndUpdate(
            { userId: id },
            { $inc: { numberOfSecretAdmirers: 1, totalScore: 1 } },
            { new: true, upsert: true }
          );

          return res
            .status(200)
            .json({ message: "You are now secretly admire" });
        }
      } else {
        throw new NotFoundException("Friend not found!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: Suggested Friends
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async suggestedFriends(query, auth, req, res) {
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;

    const findUser = await User.findById(auth);

    const findFollowers = await Followers.findOne({ userId: auth })
      .populate("followers")
      .populate("following");

    let friendList = [];

    if (findFollowers) {
      findFollowers.followers.filter((follower) => {
        friendList.push(follower._id);
      });

      findFollowers.following.filter((following) => {
        friendList.push(following._id);
      });
    }

    const findFriends = await User.find({
      _id: { $nin: friendList, $ne: auth },
      $and: [
        { interests: { $in: findUser.interests } },
        { subCultures: { $in: findUser.subCultures } },
      ],
    });

    const findData = await Promise.all(
      findFriends.map(async (friend) => {
        const checkFollowRequest = await FollowRequest.findOne({
          friendId: friend._id,
        });

        if (!checkFollowRequest || checkFollowRequest.status === 0) {
          return friend._id;
        }
      })
    );

    const finalQuery = findData.filter((id) => id !== undefined);

    const suggestedFriend = await User.find({
      _id: { $in: finalQuery },
    });

    const meta = {
      total: suggestedFriend.length,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(suggestedFriend.length / pageLimit),
    };

    return { data: new SuggestedFriendsListResource(suggestedFriend), meta };
  }
}

export default profileServices;
