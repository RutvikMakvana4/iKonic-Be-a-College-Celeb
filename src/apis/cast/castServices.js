import Cast from "../../../model/cast";
import MemoryLane from "../../../model/memoryLane";
import Followers from "../../../model/followers";
import { NotFoundException } from "../../common/exceptions/errorException";
import OneCastResource from "./resources/oneCastResource";
import mongoose from "mongoose";
import User from "../../../model/user";
import { sendUserActionNotification } from "../../common/helper";
import { STATUS, TYPE } from "../../common/constants/constants";
import Notification from "../../../model/notifications";
import PopularIkon from "../../../model/popularIkon";
const ObjectId = mongoose.Types.ObjectId;

class castServices {
  /**
   * @description: Create cast
   * @param {*} data
   * @param {*} auth
   * @param {*} file
   * @param {*} req
   * @param {*} res
   */
  static async createCast(data, auth, files, req, res) {
    try {
      // console.log(files, "allfiles");
      if (data.type == 2 || data.type == 6) {
        var uploadFile = files ? `cast/${files.uploadFile[0].filename}` : null;
      }

      if (data.type == 2 || (data.type == 6 && files.thumbnail !== undefined)) {
        var thumbnail = files
          ? `thumbnail/${files.thumbnail[0].filename}`
          : null;
      }

      let allPhotos = [];

      if (data.type == 1) {
        var imgArray = files.uploadFiles;

        for (let img of imgArray) {
          var uploadFiles = files ? `photoCast/${img.filename}` : null;
          allPhotos.push(uploadFiles);
        }
      }

      const findUser = await User.findById(auth);

      const userPostImage =
        findUser.profilePicture !== null ? findUser.profilePicture : null;

      let tagFriendImage = null;
      if (data.tagFriend) {
        const findTagFriend = await User.findById(data.tagFriend);
        if (findTagFriend && findTagFriend.profilePicture !== null) {
          tagFriendImage = findTagFriend.profilePicture;
        }
      }

      const createCast = await Cast.create({
        userId: auth,
        thumbnail: thumbnail,
        uploadFile: uploadFile,
        tagFriendImage: tagFriendImage,
        userPostImage: userPostImage,
        uploadFiles: allPhotos.length > 0 ? allPhotos : null,
        ...data,
      });

      console.log(createCast);

      await MemoryLane.create({
        castId: createCast._id,
        userId: auth,
        date: new Date(),
        image: uploadFile,
        uploadFileName: createCast.uploadFileName,
        uploadFiles:
          createCast.uploadFiles !== null ? createCast.uploadFiles : null,
        thumbnail: createCast.thumbnail,
        tagFriend: createCast.tagFriend,
        userPostImage: createCast.userPostImage,
        tagFriendImage: tagFriendImage,
      });

      if (createCast.type == 3) {
        const findTagFriend = await Followers.findOne({
          userId: createCast.tagFriend,
        });
        if (findTagFriend) {
          await Followers.findByIdAndUpdate(
            findTagFriend._id,
            { $push: { thankYou: auth } },
            { new: true }
          );

          const notificationData = {
            status: STATUS.SIX.toString(),
            auth: createCast.tagFriend.toString(),
            friendId: auth.toString(),
            castId: createCast._id.toString(),
            userName: `${findUser.firstName} ${findUser.lastName}`,
            type: TYPE.ZERO.toString(),
          };

          sendUserActionNotification(notificationData);
          // sendUserActionNotification(6, auth, createCast.tagFriend, createCast._id, `${findUser.firstName} ${findUser.lastName}`, 0);

          // Update numberOfThankyou (ikon board)
          await PopularIkon.findOneAndUpdate(
            { userId: createCast.tagFriend },
            { $inc: { numberOfThankyou: 1, totalScore: 1 } },
            { new: true, upsert: true }
          );
        }
      }

      if (createCast.type == 4) {
        const findTagFriend = await Followers.findOne({
          userId: createCast.tagFriend,
        });
        if (findTagFriend) {
          await Followers.findByIdAndUpdate(
            findTagFriend._id,
            { $push: { shoutOut: auth } },
            { new: true }
          );

          const notificationData = {
            status: STATUS.SEVEN.toString(),
            auth: createCast.tagFriend.toString(),
            friendId: auth.toString(),
            castId: createCast._id.toString(),
            userName: `${findUser.firstName} ${findUser.lastName}`,
            type: TYPE.ZERO.toString(),
          };

          sendUserActionNotification(notificationData);
          // sendUserActionNotification(7, auth, createCast.tagFriend, createCast._id, `${findUser.firstName} ${findUser.lastName}`, 0);

          // Update numberOfShoutOuts (ikon board)
          await PopularIkon.findOneAndUpdate(
            { userId: createCast.tagFriend },
            { $inc: { numberOfShoutOuts: 1, totalScore: 1 } },
            { new: true, upsert: true }
          );
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while creating the cast.");
    }
  }

  /**
   * @description: Delete cast
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async deleteCast(id, auth, req, res) {
    const findCast = await Cast.findById(id);

    if (findCast) {
      await MemoryLane.findOneAndDelete({ userId: auth, castId: findCast._id });

      await Notification.deleteMany({ castId: findCast._id });

      if (findCast.type == 3) {
        const findTagFriend = await Followers.findOne({
          userId: findCast.tagFriend,
        });
        if (findTagFriend) {
          const indexToRemove = findTagFriend.thankYou.indexOf(auth);
          if (indexToRemove !== -1) {
            findTagFriend.thankYou.splice(indexToRemove, 1);
            await findTagFriend.save();
          }
        }
      }

      if (findCast.type == 4) {
        const findTagFriend = await Followers.findOne({
          userId: findCast.tagFriend,
        });
        if (findTagFriend) {
          const indexToRemove = findTagFriend.shoutOut.indexOf(auth);
          if (indexToRemove !== -1) {
            findTagFriend.shoutOut.splice(indexToRemove, 1);
            await findTagFriend.save();
          }
        }
      }

      await Cast.findByIdAndDelete(findCast._id);
    } else {
      throw new NotFoundException("Cast not found");
    }
  }

  /**
   * @description: View cast
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async viewCast(id, auth, req, res) {
    try {
      const findCast = await Cast.aggregate([
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

      if (findCast) {
        return { ...new OneCastResource(findCast[0], auth) };
      } else {
        throw new NotFoundException("Cast not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description : Edit cast
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async editCast(id, data, auth, req, res) {
    try {
      const findCast = await Cast.findById(id);

      if (!findCast) {
        throw new NotFoundException("Cast not found");
      }

      const editCast = await Cast.findByIdAndUpdate(
        findCast._id,
        {
          ...data,
        },
        { new: true }
      );

      const updatedCast = await Cast.aggregate([
        {
          $match: {
            _id: new ObjectId(editCast._id),
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
      ]);

      return { ...new OneCastResource(updatedCast[0], auth) };
    } catch (error) {
      console.log(error, "error");
    }
  }
}

export default castServices;
