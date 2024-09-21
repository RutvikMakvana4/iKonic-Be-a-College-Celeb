import ReportIssue from "../../../model/reportIssue";
import Feedback from "../../../model/feedback";
import PrivacySecurity from "../../../model/privacyAndSecurity";
import User from "../../../model/user";
import BlockUser from "../../../model/blockUsers";
import Followers from "../../../model/followers";
import FilterCollege from "../../../model/filterColleges";
import MemoryLane from "../../../model/memoryLane";
import Cast from "../../../model/cast";
import Comment from "../../../model/comments";
import FcmStore from "../../../model/fcmToken";
import Notification from "../../../model/notifications";
import Rating from "../../../model/creativeCastRatings";
import FollowRequest from "../../../model/followRequests";
import CastViewer from "../../../model/viewerCast";

class otherServices {
  /**
   * @description: Report issues
   * @param {*} data
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async reportIssues(data, auth, req, res) {
    await ReportIssue.create({
      userId: auth,
      ...data,
    });
  }

  /**
   * @description: FeedBack
   * @param {*} data
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async feedback(data, auth, req, res) {
    await Feedback.create({
      userId: auth,
      ...data,
    });
  }

  /**
   * @description: Privacy & Security
   * @param {*} data
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async privacyAndSecurity(data, auth, req, res) {
    const findUserSettings = await PrivacySecurity.findOne({ userId: auth });

    if (!findUserSettings) {
      const userSettings = await PrivacySecurity.create({
        userId: auth,
        ...data,
      });
      return userSettings;
    } else {
      const userSettings = await PrivacySecurity.findByIdAndUpdate(
        findUserSettings._id,
        {
          ...data,
        },
        { new: true }
      );
      return userSettings;
    }
  }

  /**
   * @description: Remove user
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async deleteAccount(auth, req, res) {
    await User.findByIdAndDelete(auth);

    await BlockUser.findOneAndDelete({ userId: auth });

    await FilterCollege.findOneAndDelete({ userId: auth });

    await MemoryLane.deleteMany({ userId: auth });

    await Followers.updateMany(
      {},
      {
        $pull: {
          followers: auth,
          following: auth,
          thankYou: auth,
          shoutOut: auth,
          ikons: auth,
          secretlyAdmire: auth,
        },
      }
    );

    await Cast.deleteMany({ userId: auth });

    await Comment.deleteMany({ commentedBy: auth });

    await FcmStore.deleteMany({ userId: auth });

    await Notification.deleteMany({ userId: auth });
    await Notification.deleteMany({ friendId: auth });

    await ReportIssue.deleteMany({ userId: auth });

    await Rating.deleteMany({ userId: auth });

    await PrivacySecurity.deleteMany({ userId: auth });

    await FollowRequest.deleteMany({ userId: auth });
    await FollowRequest.deleteMany({ friendId: auth });

    await Feedback.deleteMany({ userId: auth });

    await CastViewer.deleteMany({ viewerId: auth });
  }
}

export default otherServices;
