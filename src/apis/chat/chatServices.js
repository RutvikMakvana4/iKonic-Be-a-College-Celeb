import BlockUser from "../../../model/blockUsers";
import Chat from "../../../model/chat";
import User from "../../../model/user";
import ChatFriendListResource from "./resources/chatFriendListResource";
import ChatMessageResource from "./resources/chatMessageResource";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

class chatServices {
  /**
   * @description: Chat friend list
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async chatFriendList(query, auth, req, res) {
    try {
      const page = parseInt(query.page) - 1 || 0;
      const pageLimit = parseInt(query.limit) || 20;
      const search = query.search;

      let searchQuery = {};

      if (search) {
        searchQuery = {
          $or: [
            { firstName: { $regex: ".*" + search + ".*", $options: "i" } },
            { lastName: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        };
      }

      const findUser = await User.findById(auth);

      const findFriends = await Chat.aggregate([
        {
          $match: {
            $or: [{ senderId: findUser._id }, { receiverId: findUser._id }],
          },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$senderId", findUser._id] },
                "$receiverId",
                "$senderId",
              ],
            },
            lastMessage: { $last: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "friendData",
          },
        },
        {
          $unwind: "$friendData",
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "friendDataPopulated",
          },
        },
        {
          $unwind: "$friendDataPopulated",
        },
        {
          $project: {
            friendId: "$_id",
            friendName: "$friendData.name",
            lastMessage: "$lastMessage",
            friendData: "$friendDataPopulated", // Populate friendId field with user data
            unseenMessageCount: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$lastMessage.receiverId", findUser._id] },
                    { $eq: ["$lastMessage.seenAt", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
        {
          $sort: { "lastMessage.createdAt": -1 },
        },
      ]);

      const getmyBlockUsers = await BlockUser.distinct("blockUserId", {
        userId: auth,
      });

      const blockedUserIds = getmyBlockUsers.map((user) => user._id.toString());

      const chatFriendList = findFriends.filter((friend) => {
        const friendId = friend._id.toString();
        return !blockedUserIds.includes(friendId);
      });

      const filteredAllFriends = search
        ? chatFriendList.filter((friend) => {
            console.log(friend, "folooer");
            return (
              friend.friendData.firstName
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              friend.friendData.lastName
                .toLowerCase()
                .includes(search.toLowerCase())
            );
          })
        : chatFriendList;

      const meta = {
        total: filteredAllFriends.length,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(filteredAllFriends.length / pageLimit),
      };

      return {
        data: new ChatFriendListResource(filteredAllFriends),
        meta: meta,
      };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async messageHistory(query, auth, req, res) {
    try {
      const page = parseInt(query.page) - 1 || 0;
      const pageLimit = parseInt(query.limit) || 20;
      const { receiverId } = query;

      const findUser = await User.findById(auth);

      const chatHistory = await Chat.find({
        $or: [
          {
            senderId: findUser._id,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: findUser._id,
          },
        ],
      })
        .populate("senderId")
        .populate("receiverId")
        .populate({
          path: "castDetails",
          populate: [
            { path: "userId", model: "User" },
            { path: "tagFriend", model: "User" },
            { path: "thankYouMessage", model: "CastMessages" },
            { path: "shoutOutMessage", model: "CastMessages" },
            { path: "service", model: "CastMessages" },
            { path: "feedbackRequest", model: "CastMessages" },
          ],
        })
        .skip(page * pageLimit)
        .limit(pageLimit)
        .sort({ createdAt: -1 });

      const totalData = await Chat.find({
        $or: [
          {
            senderId: findUser._id,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: findUser._id,
          },
        ],
      });

      const meta = {
        total: totalData.length,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(totalData.length / pageLimit),
      };

      return { data: new ChatMessageResource(chatHistory), meta: meta };
    } catch (error) {
      console.log(error);
    }
  }
}

export default chatServices;
