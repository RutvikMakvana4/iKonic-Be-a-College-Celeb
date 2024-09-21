import { baseUrl } from "../../../common/constants/configConstants";

export default class MapUserListResource {
  constructor(data) {
    const friends =
      data !== null
        ? data.map((data) => {
            return {
              _id: data._id,
              firstName: data.firstName,
              lastName: data.lastName,
              collegeName: data.collegeName,
              profilePicture:
                data.profilePicture !== null
                  ? baseUrl(data.profilePicture)
                  : null,
              latitude: data.latitude,
              longitude: data.longitude,
            };
          })
        : null;

    this.friends = friends;
  }
}
