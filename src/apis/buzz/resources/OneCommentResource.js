import moment from "moment";
import { baseUrl } from "../../../common/constants/configConstants";

export default class OneCommentResource {
    constructor(data) {
        this._id = data._id,
            this.date = moment(data.date).unix(),
            this.comment = data.comment,
            this.userData = {
                _id: data.commentedBy._id,
                firstName: data.commentedBy.firstName,
                lastName: data.commentedBy.lastName,
                profilePicture: data.commentedBy.profilePicture !== null ? baseUrl(data.commentedBy.profilePicture) : null,
                collegeId: data.commentedBy.collegeId,
                collegeName: data.commentedBy.collegeName
            }
    }
}