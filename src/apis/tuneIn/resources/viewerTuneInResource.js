import { baseUrl } from "../../../common/constants/configConstants";

export default class ViewerTuneInResource {
    constructor(data) {

        const viewers = data !== null ? data.map(data => {
            return {
                _id: data._id,
                userData: {
                    _id: data.view._id,
                    firstName: data.view.firstName,
                    lastName: data.view.lastName,
                    fullName: data.view.fullName,
                    collegeName: data.view.collegeName,
                    pronouns: data.view.pronouns,
                    profilePicture: data.view.profilePicture !== null ? baseUrl(data.view.profilePicture) : null
                },
                isUnlockProfile: data.isUnlockProfile
            };
        }) : null;

        this.viewers = viewers
    }
}