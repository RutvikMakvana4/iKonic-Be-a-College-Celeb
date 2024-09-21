import moment from "moment";
import { baseUrl } from "../../../common/constants/configConstants";

export default class OneNotificationResource {
    constructor(data) {
        this._id = data._id,
            this.friendId = data.friendId._id,
            this.firstName = data.friendId.firstName,
            this.lastName = data.friendId.lastName,
            this.profilePicture = data.friendId.profilePicture !== null ? baseUrl(data.friendId.profilePicture) : null,
            this.castId = data.castId,
            this.status = data.status,
            this.type = data.type,
            this.description = data.description,
            this.date = moment(data.createdAt).unix(),
            this.readAt = data.readAt
    }
}