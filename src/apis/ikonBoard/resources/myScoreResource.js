import { baseUrl } from "../../../common/constants/configConstants";

export default class MyPointsResource {
    constructor(data, rank) {
        this._id = data._id,
        this.userData = {
            _id: data.userId._id,
            firstName: data.userId.firstName,
            lastName: data.userId.lastName,
            profilePicture: data.userId.profilePicture !== null ? baseUrl(data.userId.profilePicture) : null
        },
        this.diff = data.diff,
            this.points = data.totalScore,
            this.rank = rank
    }
}

