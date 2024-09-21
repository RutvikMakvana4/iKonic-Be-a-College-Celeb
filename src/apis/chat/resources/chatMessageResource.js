import moment from "moment";
import { baseUrl } from "../../../common/constants/configConstants";

export default class ChatMessageResource {
  constructor(data) {
    const messages =
      data !== null
        ? data.map((data) => {
            if (
              data.castDetails &&
              data.castDetails.uploadFiles &&
              data.castDetails.uploadFiles.length
            ) {
              var uploadFilesArray = data.castDetails.uploadFiles.map((img) =>
                baseUrl(img)
              );
            }

            return {
              _id: data._id,
              senderId: data.senderId._id,
              receiverId: data.receiverId._id,
              type: data.type,
              message: data.message,
              castDetails: data.castDetails
                ? {
                    _id: data.castDetails._id,
                    userData: data.castDetails.userId
                      ? {
                          _id: data.castDetails.userId._id,
                          firstName: data.castDetails.userId.firstName,
                          lastName: data.castDetails.userId.lastName,
                          profilePicture:
                            data.castDetails.userId.profilePicture !== null
                              ? baseUrl(data.castDetails.userId.profilePicture)
                              : null,
                          collegeId: data.castDetails.userId.collegeId,
                          collegeName: data.castDetails.userId.collegeName,
                        }
                      : {},
                    userPostImage:
                      data.castDetails.userPostImage !== null
                        ? baseUrl(data.castDetails.userPostImage)
                        : null,
                    type: data.castDetails.type,
                    docType: data.castDetails.docType,
                    uploadFile:
                      data.castDetails.uploadFile !== null
                        ? baseUrl(data.castDetails.uploadFile)
                        : null,
                    uploadFileName: data.castDetails.uploadFileName,
                    thumbnail:
                      data.castDetails.thumbnail !== null
                        ? baseUrl(data.castDetails.thumbnail)
                        : null,
                    uploadFiles:
                      uploadFilesArray !== null ? uploadFilesArray : null,
                    location: data.castDetails.location,
                    latitude: data.castDetails.latitude,
                    longitude: data.castDetails.longitude,
                    describeCast: data.castDetails.describeCast,
                    isNominateForTrendz: data.castDetails.isNominateForTrendz,
                    thankYouMessage:
                      data.castDetails.thankYouMessage &&
                      data.castDetails.thankYouMessage.message !== null
                        ? {
                            _id: data.castDetails.thankYouMessage._id,
                            message: data.castDetails.thankYouMessage.message,
                          }
                        : null,
                    shoutOutMessage:
                      data.castDetails.shoutOutMessage &&
                      data.castDetails.shoutOutMessage.message !== null
                        ? {
                            _id: data.castDetails.shoutOutMessage._id,
                            message: data.castDetails.shoutOutMessage.message,
                          }
                        : null,
                    service:
                      data.castDetails.service &&
                      data.castDetails.service.message !== null
                        ? {
                            _id: data.castDetails.service._id,
                            message: data.castDetails.service.message,
                          }
                        : null,
                    frequency: data.castDetails.frequency,
                    amount: data.castDetails.amount,
                    feedbackRequest:
                      data.castDetails.feedbackRequest &&
                      data.castDetails.feedbackRequest.message !== null
                        ? {
                            _id: data.castDetails.feedbackRequest._id,
                            message: data.castDetails.feedbackRequest.message,
                          }
                        : null,
                    describeCreation: data.castDetails.describeCreation,
                    tagFriend: data.castDetails.friend
                      ? {
                          _id:
                            data.castDetails.friend &&
                            data.castDetails.friend._id !== null
                              ? data.castDetails.friend._id
                              : null,
                          firstName:
                            data.castDetails.friend &&
                            data.castDetails.friend.firstName !== null
                              ? data.castDetails.friend.firstName
                              : null,
                          lastName:
                            data.castDetails.friend &&
                            data.castDetails.friend.lastName !== null
                              ? data.castDetails.friend.lastName
                              : null,
                          profilePicture:
                            data.castDetails.friend &&
                            data.castDetails.friend.profilePicture !== null
                              ? baseUrl(data.castDetails.friend.profilePicture)
                              : null,
                          collegeId:
                            data.castDetails.friend &&
                            data.castDetails.friend.collegeId !== null
                              ? data.castDetails.friend.collegeId
                              : null,
                          collegeName:
                            data.castDetails.friend &&
                            data.castDetails.friend.collegeName !== null
                              ? data.castDetails.friend.collegeName
                              : null,
                        }
                      : {},
                    tagFriendImage:
                      data.castDetails.tagFriendImage !== null
                        ? baseUrl(data.castDetails.tagFriendImage)
                        : null,
                  }
                : null,
              time: moment(data.createdAt).unix(),
              seenAt: data.seenAt,
            };
          })
        : null;

    this.messages = messages;
  }
}
