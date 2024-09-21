import { baseUrl } from "../../../common/constants/configConstants";

export default class ProfileDetailsResource {
    constructor(userData, accountStatus, manageNotification, isParticipant, isFollowed, isFollowing, requestStatus, isSecretlyAdmire, isBlocked, followers, following, thankYou, shoutOut, ikons, secretAdmirer) {
        this._id = userData._id;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.pronouns = userData.pronouns;
        this.collegeName = userData.collegeName;
        this.fullName = userData.fullName;
        this.profilePicture = userData.profilePicture !== null ? baseUrl(userData.profilePicture) : null;
        this.accountStatus = accountStatus;
        this.manageNotification = manageNotification;
        this.isParticipant = isParticipant;
        this.isFollowed = isFollowed;
        this.isFollowing = isFollowing;
        this.requestStatus = requestStatus ? requestStatus : 0;
        this.isSecretlyAdmire = isSecretlyAdmire;
        this.isBlocked = isBlocked;
        this.followers = followers;
        this.following = following;
        this.thankYou = thankYou;
        this.shoutOut = shoutOut;
        this.ikons = ikons;
        this.secretAdmirer = secretAdmirer;
    }
}