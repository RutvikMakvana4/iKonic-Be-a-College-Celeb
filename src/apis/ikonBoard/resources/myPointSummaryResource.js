import { baseUrl } from "../../../common/constants/configConstants";

export default class MyPointSummaryResource {
  constructor(data, type) {
    if (type === "1") {
      this._id = data._id;
      this.userData = {
        _id: data.userId._id,
        firstName: data.userId.firstName,
        lastName: data.userId.lastName,
        profilePicture:
          data.userId.profilePicture !== null
            ? baseUrl(data.userId.profilePicture)
            : null,
      };
      this.numberOfFollowers = data.numberOfFollowers;
      this.numberOfShoutOuts = data.numberOfShoutOuts;
      this.numberOfThankyou = data.numberOfThankyou;
      this.numberOfSecretAdmirers = data.numberOfSecretAdmirers;
      this.totalScore = data.totalScore;
    }

    if (type === "2") {
      this._id = data._id;
      this.userData = {
        _id: data.userId._id,
        firstName: data.userId.firstName,
        lastName: data.userId.lastName,
        profilePicture:
          data.userId.profilePicture !== null
            ? baseUrl(data.userId.profilePicture)
            : null,
      };
      this.numberOfTrendingCasts = data.numberOfTrendingCasts;
      this.totalLikes = data.totalLikes;
      this.totalScore = data.totalScore;
    }

    if (type === "3") {
      this._id = data._id;
      this.userData = {
        _id: data.userId._id,
        firstName: data.userId.firstName,
        lastName: data.userId.lastName,
        profilePicture:
          data.userId.profilePicture !== null
            ? baseUrl(data.userId.profilePicture)
            : null,
      };
      this.numberOfCreativeCasts = data.numberOfCreativeCasts;
      this.averageRatings = data.averageRatings;
      this.numberOfRatings = data.numberOfRatings;
      this.quizPoints = data.quizPoints;
      this.totalScore = data.totalScore;
    }
  }
}
