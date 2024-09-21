import moment from "moment";
import { baseUrl } from "../../../common/constants/configConstants";

export default class NotificationListResource {
    constructor(data) {
        const notifications = data !== null ? data.map(data => {
            return {
                _id: data._id,
                friendId: data.friendId._id,
                firstName: data.friendId.firstName,
                lastName: data.friendId.lastName,
                profilePicture: data.friendId.profilePicture !== null ? baseUrl(data.friendId.profilePicture) : null,
                castId: data.castId,
                status: data.status,
                type: data.type,
                description: data.description,
                date: moment(data.createdAt).unix(),
                readAt: data.readAt
            };
        }) : null;

        this.notifications = notifications
    }
}