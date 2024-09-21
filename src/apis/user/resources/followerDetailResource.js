import { baseUrl } from "../../../common/constants/configConstants";

export default class FollowerDetailResource {
    constructor(data) {
        const userDetails = data !== null ? data.map(data => {
            return {
                _id: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                fullName: data.fullName,
                collegeName: data.collegeName,
                profilePicture: data.profilePicture !== null ? baseUrl(data.profilePicture) : null
            };
        }) : null;

        this.userDetails = userDetails
    }
}