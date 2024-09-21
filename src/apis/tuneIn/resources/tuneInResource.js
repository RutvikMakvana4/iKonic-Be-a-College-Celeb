import { baseUrl } from "../../../common/constants/configConstants";

export default class TuneInResource {
    constructor(data, auth, checkAlreadyView) {
        this.tuneInList = data !== null ? data.map(data => {
            const iAmIn = checkAlreadyView && checkAlreadyView.some(view => view.tuneInId.toString() === data._id.toString());
            return {
                _id: data._id,
                firstName: data.userId.firstName,
                lastName: data.userId.lastName,
                fullName: data.userId.fullName,
                profilePicture: data.userId.profilePicture !== null ? baseUrl(data.userId.profilePicture) : null,
                mood: data.mood ? data.mood.message : null,
                customizeMood : data.customizeMood,
                isAlreadyView: data.viewBy.includes(auth),
                iAmIn: iAmIn,
            };
        }) : null;
    }

    getData() {
        return this.tuneInList;
    }
}