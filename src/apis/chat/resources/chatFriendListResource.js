import moment from "moment";
import { baseUrl } from "../../../common/constants/configConstants";

export default class ChatFriendListResource {
  constructor(data) {
    const friends =
      data !== null
        ? data.map((data) => {
            return {
              _id: data._id,
              receiverData: {
                _id: data.friendData._id,
                firstName: data.friendData.firstName,
                lastName: data.friendData.lastName,
                profilePicture:
                  data.friendData.profilePicture !== null
                    ? baseUrl(data.friendData.profilePicture)
                    : null,
              },
              message: data.lastMessage.message,
              time: moment(data.lastMessage.createdAt).unix(),
              unseenCount: data.unseenMessageCount,
            };
          })
        : null;

    this.friends = friends;
  }
}
