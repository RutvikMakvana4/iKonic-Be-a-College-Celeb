import { baseUrl } from "../../../common/constants/configConstants";

export default class IkonBoardResource {
    constructor(data) {
        this.ikons = data !== null ? data.map((data, index) => {
            return {
                userData: {
                    _id: data.userId._id,
                    firstName: data.userId.firstName,
                    lastName: data.userId.lastName,
                    profilePicture: data.userId.profilePicture !== null ? baseUrl(data.userId.profilePicture) : null
                },
                diff: data.diff,
                points: data.totalScore,
                rank: index + 1
            };
        }) : null;
    }
}