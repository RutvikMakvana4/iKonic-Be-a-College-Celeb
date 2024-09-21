import { baseUrl } from "../../../common/constants/configConstants";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId

export default class BuzzResource {
    constructor(data, auth) {

        const casts = data !== null ? data.map((data) => {

            let totalRating = 0;

            if (data.ratingDetails && data.ratingDetails.length > 0) {
                data.ratingDetails.forEach((user) => {
                    totalRating += user.rating;
                });
            }

            const averageRating = data.ratingDetails && data.ratingDetails.length > 0 ? totalRating / data.ratingDetails.length : 0;

            if (data.uploadFiles && data.uploadFiles.length) {
                var uploadFilesArray = data.uploadFiles.map((img) => baseUrl(img))
            }

            const userRatingEntry =
              data.ratingDetails && Array.isArray(data.ratingDetails)
                ? data.ratingDetails.find(
                    (rating) =>
                      rating.userId.toString() === new ObjectId(auth).toString()
                  )
                : null;
            const myRating = userRatingEntry ? userRatingEntry.rating : null;

            return {
                _id: data._id,
                userData: data.user ? {
                    _id: data.user && data.user._id !== null ? data.user._id : null,
                    firstName: data.user && data.user.firstName !== null ? data.user.firstName : null,
                    lastName: data.user && data.user.lastName !== null ? data.user.lastName : null,
                    profilePicture: data.user && data.user.profilePicture !== null ? baseUrl(data.user.profilePicture) : null,
                    collegeId: data.user.collegeId,
                    collegeName: data.user.collegeName
                } : {},
                userPostImage: data.userPostImage !== null ? baseUrl(data.userPostImage) : null,
                type: data.type,
                docType: data.docType,
                uploadFile: data.uploadFile !== null ? baseUrl(data.uploadFile) : null,
                uploadFileName: data.uploadFileName,
                thumbnail: data.thumbnail !== null ? baseUrl(data.thumbnail) : null,
                uploadFiles: uploadFilesArray !== null ? uploadFilesArray : null,
                location: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
                describeCast: data.describeCast,
                isNominateForTrendz: data.isNominateForTrendz,
                thankYouMessage: data.thankYouMessage && data.thankYouMessage.message !== null ?
                    {
                        _id: data.thankYouMessage._id,
                        message: data.thankYouMessage.message
                    } : null,
                shoutOutMessage: data.shoutOutMessage && data.shoutOutMessage.message !== null ?
                    {
                        _id: data.shoutOutMessage._id,
                        message: data.shoutOutMessage.message
                    } : null,
                service: data.service && data.service.message !== null ?
                    {
                        _id: data.service._id,
                        message: data.service.message
                    } : null,
                frequency: data.frequency,
                amount: data.amount,
                feedbackRequest: data.feedbackRequest && data.feedbackRequest.message !== null ?
                    {
                        _id: data.feedbackRequest._id,
                        message: data.feedbackRequest.message
                    } : null,
                describeCreation: data.describeCreation,
                tagFriendImage: data.tagFriendImage !== null ? baseUrl(data.tagFriendImage) : null,
                tagFriend: data.friend ? {
                    _id: data.friend && data.friend._id !== null ? data.friend._id : null,
                    firstName: data.friend && data.friend.firstName !== null ? data.friend.firstName : null,
                    lastName: data.friend && data.friend.lastName !== null ? data.friend.lastName : null,
                    fullName: data.friend && data.friend.fullName !== null ? data.friend.fullName : null,
                    profilePicture: data.friend && data.friend.profilePicture !== null ? baseUrl(data.friend.profilePicture) : null,
                    collegeId: data.friend && data.friend.collegeId !== null ? data.friend.collegeId : null,
                    collegeName: data.friend && data.friend.collegeName !== null ? data.friend.collegeName : null,
                } : {},
                isLiked: data.likes ? data.likes.some(like => like.toString() === new ObjectId(auth).toString()) : false,
                isRating: data.ratingDetails ? data.ratingDetails.some(rating => rating.userId.toString() ===  new ObjectId(auth).toString()) : false,
                likes: data.likes.length,
                ratings: averageRating,
                myRating: myRating,
                totalUserRating: data.ratingDetails && data.ratingDetails.length > 0 ? data.ratingDetails.length : 0,
                viewCount: data.castviewers && data.castviewers.length > 0 ? data.castviewers.length : 0,
                commentsCount : data.commentsCount !== null ? data.commentsCount : 0
            };
        }) : null;

        this.casts = casts
    }
}