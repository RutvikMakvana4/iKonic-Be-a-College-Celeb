import { baseUrl } from "../../../common/constants/configConstants";

export default class UserDetailsResource {
    constructor(data) {
        this._id = data._id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.countryCode = data.countryCode;
        this.phone = data.phone;
        this.isVerify = data.isVerify;
        this.dateOfBirth = data.dateOfBirth;
        this.pronouns = data.pronouns;
        this.collegeId = data.collegeId;
        this.collegeName = data.collegeName;
        this.isAgree = data.isAgree;
        this.isSheerVerified = data.isSheerVerified;
        this.isAccountActive = data.isAccountActive;
        this.fullName = data.fullName;
        this.bio = data.bio;
        this.profilePicture = data.profilePicture !== null ? baseUrl(data.profilePicture) : null
        this.interests = data.interests ? this.transformInterests(data.interests) : [];
        this.subCultures = data.subCultures ? this.transformsubCultures(data.subCultures) : [];
    }

    transformInterests(interests) {
        console.log(interests)
        return interests.map(interest => ({
            _id: interest._id,
            image: interest.image,
            name: interest.name
        }));
    }

    transformsubCultures(subCultures) {
        return subCultures.map(subCulture => ({
            _id: subCulture._id,
            image: subCulture.image,
            name: subCulture.name
        }));
    }

}