import moment from "moment";
import { baseUrl } from "../../../common/constants/configConstants";

export default class CastCommentResource {
    constructor(data) {
        const comments = data !== null ? data.map(data => {
            return {
                _id: data._id,
                date: moment(data.date).unix(),
                comment: data.comment,
                userData: {
                    _id: data.commentedBy._id,
                    firstName: data.commentedBy.firstName,
                    lastName: data.commentedBy.lastName,
                    profilePicture: data.commentedBy.profilePicture !== null ? baseUrl(data.commentedBy.profilePicture) : null,
                    collegeId: data.commentedBy.collegeId,
                    collegeName: data.commentedBy.collegeName
                }
                };
            }) : null;

        this.comments = comments
    }
}