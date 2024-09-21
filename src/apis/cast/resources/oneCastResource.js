import { baseUrl } from "../../../common/constants/configConstants";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId

export default class OneCastResource {
    constructor(data, auth) {

        let totalRating = 0;

        if (data.ratingDetails && data.ratingDetails.length > 0) {
            data.ratingDetails.forEach((user) => {
                totalRating += user.rating;
            });
        }

        const averageRating = data.ratingDetails && data.ratingDetails.length > 0 ? totalRating / data.ratingDetails.length : 0;

         if (data.uploadFiles && data.uploadFiles.length) {
           var uploadFilesArray = data.uploadFiles.map((img) => baseUrl(img));
        }
        
        const userRatingEntry =
          data.ratingDetails && Array.isArray(data.ratingDetails)
            ? data.ratingDetails.find(
                (rating) => rating.userId.toString() === auth.toString()
              )
            : null;
        const myRating = userRatingEntry ? userRatingEntry.rating : null;

        this._id = data._id,
            this.userData = data.user ? {
                _id: data.user._id,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                profilePicture: data.user.profilePicture !== null ? baseUrl(data.user.profilePicture) : null,
                collegeId: data.user.collegeId,
                collegeName: data.user.collegeName
            } : {},
            this.userPostImage = data.userPostImage !== null ? baseUrl(data.userPostImage) : null,
            this.type = data.type,
            this.docType = data.docType,
            this.uploadFile = data.uploadFile !== null ? baseUrl(data.uploadFile) : null,
            this.uploadFileName = data.uploadFileName,
            this.thumbnail = data.thumbnail !== null ? baseUrl(data.thumbnail) : null,
            this.uploadFiles = uploadFilesArray !== null ? uploadFilesArray : null,
            this.location = data.location,
            this.latitude = data.latitude,
            this.longitude = data.longitude,
            this.describeCast = data.describeCast,
            this.isNominateForTrendz = data.isNominateForTrendz,
            this.thankYouMessage = data.thankYouMessage && data.thankYouMessage.message !== null ?
                {
                    _id: data.thankYouMessage._id,
                    message: data.thankYouMessage.message
                } : null,
            this.shoutOutMessage = data.shoutOutMessage && data.shoutOutMessage.message !== null ?
                {
                    _id: data.shoutOutMessage._id,
                    message: data.shoutOutMessage.message
                } : null,
            this.service = data.service && data.service.message !== null ?
                {
                    _id: data.service._id,
                    message: data.service.message
                } : null,
            this.frequency = data.frequency,
            this.amount = data.amount,
            this.feedbackRequest = data.feedbackRequest && data.feedbackRequest.message !== null ?
                {
                    _id: data.feedbackRequest._id,
                    message: data.feedbackRequest.message
                } : null,
            this.describeCreation = data.describeCreation,
            this.tagFriend = data.friend ? {
                _id: data.friend && data.friend._id !== null ? data.friend._id : null,
                firstName: data.friend && data.friend.firstName !== null ? data.friend.firstName : null,
                lastName: data.friend && data.friend.lastName !== null ? data.friend.lastName : null,
                fullName: data.friend && data.friend.fullName !== null ? data.friend.fullName : null,
                profilePicture: data.friend && data.friend.profilePicture !== null ? baseUrl(data.friend.profilePicture) : null,
                collegeId: data.friend && data.friend.collegeId !== null ? data.friend.collegeId : null,
                collegeName: data.friend && data.friend.collegeName !== null ? data.friend.collegeName : null,
            } : {},
            this.tagFriendImage = data.tagFriendImage !== null ? baseUrl(data.tagFriendImage) : null,
            this.isLiked = data.likes ? data.likes.some(like => like.toString() === new ObjectId(auth).toString()) : false,
            this.isRating = data.ratingDetails ? data.ratingDetails.some(rating => rating.userId.toString() === new ObjectId(auth).toString()) : false,
            this.myRating = myRating,
            this.likes = data.likes.length,
            this.ratings = averageRating,
            this.totalUserRating = data.ratingDetails && data.ratingDetails.length > 0 ? data.ratingDetails.length : 0,
            this.viewCount = data.castviewers && data.castviewers.length > 0 ? data.castviewers.length : 0,
            this.commentsCount = data.commentsCount !== null ? data.commentsCount : 0
    }
}
