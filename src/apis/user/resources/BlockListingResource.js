import { baseUrl } from "../../../common/constants/configConstants";

export default class BlockUserListingResource {
    constructor(data) {
        const userDetails = data !== null ? data.map(data => {
            return {
                _id: data.blockUserId._id,
                firstName: data.blockUserId.firstName,
                lastName: data.blockUserId.lastName,
                fullName: data.blockUserId.fullName,
                collegeName: data.blockUserId.collegeName,
                profilePicture: data.blockUserId.profilePicture !== null ? baseUrl(data.blockUserId.profilePicture) : null
            };
        }) : null;

        this.userDetails = userDetails
    }
}