import { baseUrl } from "../../../common/constants/configConstants";

export default class FriendTuneInResource {
    constructor(data, iAmIn) {
        this._id = data._id,
            this.firstName = data.userId.firstName,
            this.lastName = data.userId.lastName,
            this.fullName = data.userId.fullName,
            this.profilePicture = data.userId.profilePicture !== null ? baseUrl(data.userId.profilePicture) : null,
            this.mood = data.mood ? data.mood.message : null,
            this.customizeMood = data.customizeMood,
            this.isAlreadyView = true,
            this.iAmIn = iAmIn
    }
}

