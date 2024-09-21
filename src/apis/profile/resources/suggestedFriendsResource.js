import { baseUrl } from "../../../common/constants/configConstants";

export default class SuggestedFriendsListResource {
  constructor(data) {
    const friends =
      data !== null
        ? data.map((data) => {
            return {
              _id: data._id,
              firstName: data.firstName,
              lastName: data.lastName,
              fullName: data.fullName,
              collegeName: data.collegeName,
              profilePicture:
                data.profilePicture !== null
                  ? baseUrl(data.profilePicture)
                  : null,
              requestStatus: data.requestStatus
            };
          })
        : null;

    this.friends = friends;
  }
}
