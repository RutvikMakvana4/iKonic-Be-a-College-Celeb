import Likes from "../../../model/likes";
import Participants from "../../../model/participants";
import Season from "../../../model/season";
import User from "../../../model/user";
import { baseUrl } from "../../common/constants/configConstants";
import { PAGINATION } from "../../common/constants/constants";
import {
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/errorException";
import { unlinkFile } from "../../common/helper";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
class StyleIkonService {
  /**
   * @description Participate in season
   * @param {*} user
   * @param {*} files
   * @returns
   */
  static async participate(authUser, files) {
    const exist = await Participants.findOne({ userId: authUser });
    const user = await User.findById(authUser);

    if (exist) {
      if (files.images.length > 0) {
        for (const file of files.images) {
          unlinkFile(file.destination + "/" + file.filename);
        }
      }
      throw new ConflictException("Already participated");
    }
    const season = await Season.findOne({ isActive: true });

    // Given date
    const givenDate = new Date(season.startDate);

    // Get the last date of the month for the given date
    const lastDateOfMonth = new Date(
      givenDate.getFullYear(),
      givenDate.getMonth() + 1,
      0
    );

    // Get the current date
    const currentDate = new Date();

    // Check if the current date is greater than the last date of the month
    if (currentDate > lastDateOfMonth) {
      throw new ConflictException(
        "You can't participate beacuse voting is closed."
      );
    }

    const images = [];
    if (files.images.length > 0) {
      for (const file of files.images) {
        images.push(file.destination + "/" + file.filename);
      }
    }

    await Participants.create({
      userId: authUser,
      images: images,
      seasonId: season._id,
      collegeId: user.collegeId,
    });

    return "Uploaded/Participated successfully.";
  }

  /**
   * @description Like/Dislike
   * @param {*} authUser
   * @param {*} id
   * @returns
   */
  static async likeDislike(authUser, id) {
    if (!(await Participants.findOne({ _id: id }))) {
      throw new NotFoundException("Not Participated yet.");
    }
    const exist = await Likes.findOne({ userId: authUser, participantId: id });

    if (exist) {
      await Likes.deleteOne({ _id: exist._id });
      // return "Profile disliked";
    } else {
      await Likes.create({
        userId: authUser,
        participantId: id,
      });
      // return "Profile liked";
    }

    const data = await this.intraClgParticipants(authUser, {
      participantId: id,
      type: 1,
    });
    // console.log(data.data[0]);

    return {
      participantId: data.data[0]._id,
      images: data.data[0].images.map((img) => ({
        img: baseUrl(img.replace("public/", "")),
      })),
      likes: data.data[0].likesCount,
      firstName: data.data[0].participantInfo.firstName,
      lastName: data.data[0].participantInfo.lastName,
      college: data.data[0].participantInfo.collegeName,
      // userId: +type == 2 ? participant.userId : null,
      // collegeId: +type == 2 ? participant.collegeId : null,
      profileImage:
        data.data[0].participantInfo.profilePicture != null
          ? baseUrl(data.data[0].participantInfo.profilePicture)
          : null,
      islike: data.data[0].islike && data.data[0].islike != null ? true : false,
    };
  }

  /**
   * @description Intra Colllege Participants
   * @param {*} authUser
   */
  static async intraClgParticipants(authUser, reqData) {
    const currentPage = reqData.page || PAGINATION.DEFAULT_PAGE;
    const perPage = reqData.perPage || PAGINATION.DEFAULT_PER_PAGE;
    const skip = Number((currentPage - 1) * perPage);
    const limit = Number(perPage);
    const pipline = [];
    let total;
    let participants;
    if (reqData.type == 1) {
      const user = await User.findById(authUser);
      const season = await Season.findOne({ isActive: true });

      if (reqData.participantId) {
        pipline.push({
          $match: {
            _id: new ObjectId(reqData.participantId),
          },
        });
      }

      pipline.push(
        {
          $match: {
            collegeId: user.collegeId,
            seasonId: new ObjectId(season._id),
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
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "participantInfo",
          },
        },
        {
          $unwind: "$participantInfo",
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
        }
      );

      if (reqData.search) {
        pipline.push({
          $match: {
            $or: [
              {
                "participantInfo.firstName": {
                  $regex: reqData.search,
                  $options: "i",
                },
              },
              {
                "participantInfo.lastName": {
                  $regex: reqData.search,
                  $options: "i",
                },
              },
            ],
          },
        });
      }

      total = await Participants.aggregate(pipline);

      pipline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );

      participants = await Participants.aggregate(pipline);
    } else if (reqData.type == 2) {
      pipline.push(
        // Group by collegeId and participantId, count the number of likes for each participant
        {
          $group: {
            _id: {
              collegeId: "$collegeId",
              participantId: "$participantId",
            },
            likesCount: { $sum: 1 },
          },
        },
        // Lookup to fetch collegeId from participants table
        {
          $lookup: {
            from: "participants",
            localField: "_id.participantId",
            foreignField: "_id",
            as: "participant",
          },
        },
        // Unwind the participant array
        { $unwind: "$participant" },
        // Lookup to fetch user details from users table using userId
        {
          $lookup: {
            from: "users",
            localField: "participant.userId",
            foreignField: "_id",
            as: "user",
          },
        },
        // Unwind the user array
        { $unwind: "$user" },
        // Project to show necessary fields
        {
          $project: {
            _id: 0,
            collegeId: "$participant.collegeId",
            images: "$participant.images",
            participantId: "$_id.participantId",
            likesCount: 1,
            userId: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            collegeName: "$user.collegeName",
            profilePicture: "$user.profilePicture",
          },
        },

        // Sort by likesCount in descending order within each collegeId
        { $sort: { collegeId: 1, likesCount: -1 } },
        // Group by collegeId to group participants with the same highest likes count
        {
          $group: {
            _id: "$collegeId",
            maxLikesCount: { $first: "$likesCount" },
            participants: { $push: "$$ROOT" },
          },
        },
        // Unwind the participants array
        { $unwind: "$participants" },
        // Project to filter participants with the highest likes count
        {
          $project: {
            _id: 0,
            collegeId: "$_id",
            likesCount: "$participants.likesCount",
            images: "$participants.images",
            participantId: "$participants.participantId",
            userId: "$participants.userId",
            firstName: "$participants.firstName",
            lastName: "$participants.lastName",
            collegeName: "$participants.collegeName",
            profilePicture: "$participants.profilePicture",
          },
        },
        // Group by collegeId to find the maximum likesCount within each college
        {
          $group: {
            _id: "$collegeId",
            maxLikesCount: { $max: "$likesCount" },
            participants: { $push: "$$ROOT" },
          },
        },
        // Unwind the participants array
        { $unwind: "$participants" },
        // Project to keep only participants with the absolute highest likesCount per college
        {
          $project: {
            collegeId: "$_id",
            maxLikesCount: 1,
            participants: {
              $cond: {
                if: { $eq: ["$participants.likesCount", "$maxLikesCount"] },
                then: "$participants",
                else: null,
              },
            },
          },
        },
        // Unwind the participants array again
        { $unwind: "$participants" },
        // Replace the root
        { $replaceRoot: { newRoot: "$participants" } },
        // Project to reshape the output document
        {
          $project: {
            _id: 0,
            collegeId: 1,
            likesCount: 1,
            images: 1,
            participantId: 1,
            userId: 1,
            firstName: 1,
            lastName: 1,
            collegeName: 1,
            profilePicture: 1,
          },
        }
      );

      // const regexPattern = `.*${reqData.search}.*`;
      if (reqData.search) {
        pipline.push({
          $match: {
            $or: [
              {
                firstName: {
                  $regex: reqData.search,
                  $options: "i",
                },
              },
              {
                lastName: {
                  $regex: reqData.search,
                  $options: "i",
                },
              },
            ],
          },
        });
      }

      total = await Likes.aggregate(pipline);

      pipline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );

      participants = await Likes.aggregate(pipline);
      participants.sort((a, b) => {
        if (a.likesCount !== b.likesCount) {
          return b.likesCount - a.likesCount;
        } else {
          // If likes count is same, maintain original order
          return 0;
        }
      });
    }

    participants.type = reqData.type;

    if (participants.length > 0) {
      for (const p of participants) {
        p.islike = await Likes.findOne({
          userId: new ObjectId(authUser),
          participantId: participants.type == 1 ? p._id : p.participantId,
        });
      }
    }

    return {
      data: participants,
      meta: {
        total: total.length,
        get lastPage() {
          return this.total ? Math.ceil(Number(this.total / this.perPage)) : 0;
        },
        perPage: Number(perPage),
        currentPage: Number(currentPage),
      },
    };
    // return reqData.participantId ? participants[0] : participants;
  }

  /**
   * @description National College Round Participants
   * @param {*} authUser
   * @param {*} reqData
   */
  static async nationalParticipants(authUser, reqData) {
    const currentPage = reqData.page || PAGINATION.DEFAULT_PAGE;
    const perPage = reqData.perPage || PAGINATION.DEFAULT_PER_PAGE;
    const skip = Number((currentPage - 1) * perPage);
    const limit = Number(perPage);

    const pipeline = [];

    pipeline.push(
      // Group by collegeId and participantId, count the number of likes for each participant
      {
        $group: {
          _id: {
            collegeId: "$collegeId",
            participantId: "$participantId",
          },
          likesCount: { $sum: 1 },
        },
      },
      // Lookup to fetch collegeId from participants table
      {
        $lookup: {
          from: "participants",
          localField: "_id.participantId",
          foreignField: "_id",
          as: "participant",
        },
      },
      // Unwind the participant array
      { $unwind: "$participant" },
      // Lookup to fetch user details from users table using userId
      {
        $lookup: {
          from: "users",
          localField: "participant.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      // Unwind the user array
      { $unwind: "$user" },
      // Project to show necessary fields
      {
        $project: {
          _id: 0,
          collegeId: "$participant.collegeId",
          images: "$participant.images",
          participantId: "$_id.participantId",
          likesCount: 1,
          userId: "$user._id",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          collegeName: "$user.collegeName",
          profilePicture: "$user.profilePicture",
        },
      },
      // Add base URL to images array
      {
        $addFields: {
          images: {
            $map: {
              input: "$images",
              as: "image",
              in: {
                $concat: [
                  baseUrl() + "/",
                  {
                    $substr: [
                      "$$image",
                      7,
                      { $subtract: [{ $strLenCP: "$$image" }, 7] },
                    ],
                  },
                ],
              }, // Replace <base_url> with your actual base URL
            },
          },
        },
      },
      // Add base URL to profilePicture
      // Add base URL to profilePicture (with null check)
      {
        $addFields: {
          profilePicture: {
            $cond: {
              if: { $ne: ["$profilePicture", null] },
              then: { $concat: [baseUrl(), "/", "$profilePicture"] },
              else: null,
            },
          },
        },
      },
      // Sort by likesCount in descending order within each collegeId
      { $sort: { collegeId: 1, likesCount: -1 } },
      // Group by collegeId to group participants with the same highest likes count
      {
        $group: {
          _id: "$collegeId",
          maxLikesCount: { $first: "$likesCount" },
          participants: { $push: "$$ROOT" },
        },
      },
      // Unwind the participants array
      { $unwind: "$participants" },
      // Project to filter participants with the highest likes count
      {
        $project: {
          _id: 0,
          collegeId: "$_id",
          likesCount: "$participants.likesCount",
          images: "$participants.images",
          participantId: "$participants.participantId",
          userId: "$participants.userId",
          firstName: "$participants.firstName",
          lastName: "$participants.lastName",
          collegeName: "$participants.collegeName",
          profilePicture: "$participants.profilePicture",
        },
      },
      // Group by collegeId to find the maximum likesCount within each college
      {
        $group: {
          _id: "$collegeId",
          maxLikesCount: { $max: "$likesCount" },
          participants: { $push: "$$ROOT" },
        },
      },
      // Unwind the participants array
      { $unwind: "$participants" },
      // Project to keep only participants with the absolute highest likesCount per college
      {
        $project: {
          collegeId: "$_id",
          maxLikesCount: 1,
          participants: {
            $cond: {
              if: { $eq: ["$participants.likesCount", "$maxLikesCount"] },
              then: "$participants",
              else: null,
            },
          },
        },
      },
      // Unwind the participants array again
      { $unwind: "$participants" },
      // Replace the root
      { $replaceRoot: { newRoot: "$participants" } },
      // Project to reshape the output document
      {
        $project: {
          _id: 0,
          collegeId: 1,
          likesCount: 1,
          images: 1,
          participantId: 1,
          userId: 1,
          firstName: 1,
          lastName: 1,
          collegeName: 1,
          profilePicture: 1,
        },
      }
    );

    // const regexPattern = `.*${reqData.search}.*`;
    if (reqData.search) {
      pipeline.push({
        $match: {
          $or: [
            {
              firstName: {
                $regex: reqData.search,
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: reqData.search,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    const total = await Likes.aggregate(pipeline);

    pipeline.push(
      {
        $skip: skip,
      },
      {
        $limit: limit,
      }
    );

    const participants = await Likes.aggregate(pipeline);
    participants.sort((a, b) => {
      if (a.likesCount !== b.likesCount) {
        return b.likesCount - a.likesCount;
      } else {
        // If likes count is same, maintain original order
        return 0;
      }
    });

    return participants;
  }

  /**
   * @description Leading Universities list
   */
  static async leadingUniversities() {
    const pipline = [];
    let participants;

    pipline.push(
      // Group by collegeId and participantId, count the number of likes for each participant
      {
        $group: {
          _id: {
            collegeId: "$collegeId",
            participantId: "$participantId",
          },
          likesCount: { $sum: 1 },
        },
      },
      // Lookup to fetch collegeId from participants table
      {
        $lookup: {
          from: "participants",
          localField: "_id.participantId",
          foreignField: "_id",
          as: "participant",
        },
      },
      // Unwind the participant array
      { $unwind: "$participant" },
      // Lookup to fetch user details from users table using userId
      {
        $lookup: {
          from: "users",
          localField: "participant.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      // Unwind the user array
      { $unwind: "$user" },
      // Project to show necessary fields
      {
        $project: {
          _id: 0,
          collegeId: "$participant.collegeId",
          images: "$participant.images",
          participantId: "$_id.participantId",
          likesCount: 1,
          userId: "$user._id",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          collegeName: "$user.collegeName",
          profilePicture: "$user.profilePicture",
        },
      },

      // Sort by likesCount in descending order within each collegeId
      { $sort: { collegeId: 1, likesCount: -1 } },
      // Group by collegeId to group participants with the same highest likes count
      {
        $group: {
          _id: "$collegeId",
          maxLikesCount: { $first: "$likesCount" },
          participants: { $push: "$$ROOT" },
        },
      },
      // Unwind the participants array
      { $unwind: "$participants" },
      // Project to filter participants with the highest likes count
      {
        $project: {
          _id: 0,
          collegeId: "$_id",
          likesCount: "$participants.likesCount",
          images: "$participants.images",
          participantId: "$participants.participantId",
          userId: "$participants.userId",
          firstName: "$participants.firstName",
          lastName: "$participants.lastName",
          collegeName: "$participants.collegeName",
          profilePicture: "$participants.profilePicture",
        },
      },
      // Group by collegeId to find the maximum likesCount within each college
      {
        $group: {
          _id: "$collegeId",
          maxLikesCount: { $max: "$likesCount" },
          participants: { $push: "$$ROOT" },
        },
      },
      // Unwind the participants array
      { $unwind: "$participants" },
      // Project to keep only participants with the absolute highest likesCount per college
      {
        $project: {
          collegeId: "$_id",
          maxLikesCount: 1,
          participants: {
            $cond: {
              if: { $eq: ["$participants.likesCount", "$maxLikesCount"] },
              then: "$participants",
              else: null,
            },
          },
        },
      },
      // Unwind the participants array again
      { $unwind: "$participants" },
      // Replace the root
      { $replaceRoot: { newRoot: "$participants" } },
      // Project to reshape the output document
      {
        $project: {
          _id: 0,
          collegeId: 1,
          likesCount: 1,
          images: 1,
          participantId: 1,
          userId: 1,
          firstName: 1,
          lastName: 1,
          collegeName: 1,
          profilePicture: 1,
        },
      }
    );

    participants = await Likes.aggregate(pipline);
    participants.sort((a, b) => {
      if (a.likesCount !== b.likesCount) {
        return b.likesCount - a.likesCount;
      } else {
        // If likes count is same, maintain original order
        return 0;
      }
    });

    // Step 1: Sort participants by likes count in descending order
    participants.sort((a, b) => b.likesCount - a.likesCount);

    // Step 2: Assign ranks dynamically based on likes count
    let rank = 1;
    let prevLikesCount = participants[0].likesCount;

    for (let i = 0; i < participants.length; i++) {
      if (participants[i].likesCount < prevLikesCount) {
        rank++; // Increment rank when encountering a new likes count
        prevLikesCount = participants[i].likesCount;
      }

      participants[i].rank = rank;
    }

    // const rankedParticipants = rankParticipants(participants);

    return participants;
  }
}

export default StyleIkonService;
