import { baseUrl } from "../../../common/constants/configConstants";
import moment from "moment";

export default class MemoryLaneResource {
    constructor(memoryLanePhotos) {

        const memoryLane = memoryLanePhotos !== null ? memoryLanePhotos.map(data => {

            if (data.uploadFiles && data.uploadFiles.length) {
               var uploadFilesArray = data.uploadFiles.map((img) =>
                 baseUrl(img)
               );
            }

            return {
                _id: data.cast._id,
                userData: data.user ? {
                    _id: data.user && data.user._id !== null ? data.user._id : null,
                    firstName: data.user && data.user.firstName !== null ? data.user.firstName : null,
                    lastName: data.user && data.user.lastName !== null ? data.user.lastName : null,
                    fullName: data.user && data.user.fullName !== null ? data.user.fullName : null,
                    profilePicture: data.user && data.user.profilePicture !== null ? baseUrl(data.user.profilePicture) : null,
                } : {},
                userPostImage: data.userPostImage !== null ? baseUrl(data.userPostImage) : null,
                type: data.cast.type,
                docType: data.cast.docType,
                uploadFile: data.cast.uploadFile !== null ? baseUrl(data.cast.uploadFile) : null,
                uploadFileName: data.cast.uploadFileName,
                uploadFiles: uploadFilesArray !== null ? uploadFilesArray : null,
                thumbnail: data.cast.thumbnail !== null ? baseUrl(data.cast.thumbnail) : null,
                location: data.cast.location,
                latitude: data.cast.latitude,
                longitude: data.cast.longitude,
                describeCast: data.cast.describeCast,
                isNominateForTrendz: data.cast.isNominateForTrendz,
                thankYouMessage: data.cast.thankYouMessage && data.cast.thankYouMessage.message !== null ?
                    {
                        _id: data.cast.thankYouMessage._id,
                        message: data.cast.thankYouMessage.message
                    } : null,
                shoutOutMessage: data.cast.shoutOutMessage && data.cast.shoutOutMessage.message !== null ?
                    {
                        _id: data.cast.shoutOutMessage._id,
                        message: data.cast.shoutOutMessage.message
                    } : null,
                service: data.cast.service && data.cast.service.message !== null ?
                    {
                        _id: data.cast.service._id,
                        message: data.cast.service.message
                    } : null,
                frequency: data.cast.frequency,
                amount: data.cast.amount,
                feedbackRequest: data.cast.feedbackRequest && data.cast.feedbackRequest.message !== null ?
                    {
                        _id: data.cast.feedbackRequest._id,
                        message: data.cast.feedbackRequest.message
                    } : null,
                describeCreation: data.cast.describeCreation,
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
                date: moment(data.date).unix()
            };
        }) : null;

        this.memoryLane = memoryLane
    }
}