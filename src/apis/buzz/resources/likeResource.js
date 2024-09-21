import { baseUrl } from "../../../common/constants/configConstants";

export default class LikeResource {
    constructor(data, auth) {
        this._id = data._id,
            this.userData = data.userId ? {
                _id: data.userId._id,
                firstName: data.userId.firstName,
                lastName: data.userId.lastName,
                fullName: data.userId.fullName,
                profilePicture: data.userId.profilePicture !== null ? baseUrl(data.userId.profilePicture) : null,
            } : {},
            this.userPostImage = data.userPostImage !== null ? baseUrl(data.userPostImage) : null,
            this.type = data.type,
            this.docType = data.docType,
            this.uploadFile = data.uploadFile !== null ? baseUrl(data.uploadFile) : null,
            this.thumbnail = data.thumbnail !== null ? baseUrl(data.thumbnail) : null,
            this.uploadFileName = data.uploadFileName,
            this.location = data.location,
            this.latitude = data.latitude,
            this.longitude = data.longitude,
            this.describeCast = data.describeCast,
            this.thankYouMessage = data.thankYouMessage && data.thankYouMessage.message !== null ? data.thankYouMessage.message : null,
            this.shoutOutMessage = data.shoutOutMessage && data.shoutOutMessage.message !== null ? data.shoutOutMessage.message : null,
            this.service = data.service && data.service.message !== null ? data.service.message : null,
            this.feedbackRequest = data.feedbackRequest && data.feedbackRequest.message !== null ? data.feedbackRequest.message : null,
            this.describeCreation = data.describeCreation,
            this.tagFriend = data.tagFriend ? {
                _id: data.tagFriend && data.tagFriend._id !== null ? data.tagFriend._id : null,
                firstName: data.tagFriend && data.tagFriend.firstName !== null ? data.tagFriend.firstName : null,
                lastName: data.tagFriend && data.tagFriend.lastName !== null ? data.tagFriend.lastName : null,
                fullName: data.tagFriend && data.tagFriend.fullName !== null ? data.tagFriend.fullName : null,
                profilePicture: data.tagFriend && data.tagFriend.profilePicture !== null ? baseUrl(data.tagFriend.profilePicture) : null,
                collegeId: data.tagFriend && data.tagFriend.collegeId !== null ? data.tagFriend.collegeId : null,
                collegeName: data.tagFriend && data.tagFriend.collegeName !== null ? data.tagFriend.collegeName : null,
            } : {},
            this.tagFriendImage = data.tagFriendImage !== null ? baseUrl(data.tagFriendImage) : null,
            this.isLiked = data.likes.includes(auth),
            this.likes = data.likes.length
    }
}
