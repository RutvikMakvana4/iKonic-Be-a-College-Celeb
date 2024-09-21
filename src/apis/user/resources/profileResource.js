import { baseUrl } from "../../../common/constants/configConstants";

export default class ProfileResource {
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
        this.isUploaded = data.isUploaded;
        this.isAccountActive = data.isAccountActive;
        this.bio = data.bio;
        this.profilePicture = data.profilePicture !== null ? baseUrl(data.profilePicture) : null
        this.interests = data.interests ? this.transformInterests(data.interests) : [];
        this.subCultures = data.subCultures ? this.transformsubCultures(data.subCultures) : [];
        this.location = {
            latitude: data.latitude,
            longitude: data.longitude
        };
        this.register_process = {
            step_one: (this.firstName && this.lastName && this.email && this.countryCode && this.phone) !== null ? true : false,
            step_two: this.isVerify !== true ? false : true,
            step_three: this.dateOfBirth !== null ? true : false,
            step_four: this.pronouns !== null ? true : false,
            step_five: (this.collegeId && this.collegeName) !== null ? true : false,
            step_six: this.isAgree !== true ? false : true,
            step_seven: this.bio !== null ? true : false,
            step_eight: this.profilePicture !== null ? true : false,
            step_nine: this.interests.length !== 0 ? true : false,
            step_ten: this.subCultures.length !== 0 ? true : false
        };
        this.currentSeason = data.currentSeason
    }

    transformInterests(interests) {
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