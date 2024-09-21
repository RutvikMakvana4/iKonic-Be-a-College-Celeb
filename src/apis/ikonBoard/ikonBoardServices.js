import PopularIkon from "../../../model/popularIkon";
import TrendingCreator from "../../../model/trendingCreator";
import TalentedIkon from "../../../model/talentedIkon";
import IkonBoardResource from "./resources/ikonBoardResource";
import MyPointsResource from "./resources/myScoreResource";
import { BadRequestException } from "../../../src/common/exceptions/errorException";
import MyPointSummaryResource from "./resources/myPointSummaryResource";
class ikonBoardServices {
  /**
   * @description : Users ikon details
   * @param {*} auth
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async userIkonDetails(query, auth, req, res) {
    const type = query.type;

    if (type === "1") {
      console.log("1 - Popular Ikon");

      const otherPoints = await PopularIkon.find({})
        .populate("userId")
        .sort({ totalScore: -1 })
        .limit(5);

      const myScore = await PopularIkon.findOne({ userId: auth }).populate(
        "userId"
      );

      const myScoreRank =
        otherPoints.findIndex((point) => point.userId.equals(auth)) + 1;

      return {
        otherPoints: new IkonBoardResource(otherPoints).ikons,
        myScore:
          myScore !== null ? new MyPointsResource(myScore, myScoreRank) : null,
        lastMonthWinner: null,
      };
    } else if (type === "2") {
      console.log("2 - Trending Creator");
      const otherPoints = await TrendingCreator.find({})
        .populate("userId")
        .sort({ totalScore: -1 })
        .limit(5);

      const myScore = await TrendingCreator.findOne({ userId: auth }).populate(
        "userId"
      );

      const myScoreRank =
        otherPoints.findIndex((point) => point.userId.equals(auth)) + 1;

      return {
        otherPoints: new IkonBoardResource(otherPoints).ikons,
        myScore:
          myScore !== null ? new MyPointsResource(myScore, myScoreRank) : null,
        lastMonthWinner: null,
      };
    } else if (type === "3") {
      console.log("3 - Talented Ikon");
      const otherPoints = await TalentedIkon.find({})
        .populate("userId")
        .sort({ totalScore: -1 })
        .limit(5);

      const myScore = await TalentedIkon.findOne({ userId: auth }).populate(
        "userId"
      );

      const myScoreRank =
        otherPoints.findIndex((point) => point.userId.equals(auth)) + 1;

      return {
        otherPoints: new IkonBoardResource(otherPoints).ikons,
        myScore:
          myScore !== null ? new MyPointsResource(myScore, myScoreRank) : null,
        lastMonthWinner: null,
      };
    }
  }

  /**
   * @description: User ikon points summary
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async userPointSummary(query, auth, req, res) {
    const type = query.type;
    const userId = query.userId;

    if (type === "1") {
      const myScore = await PopularIkon.findOne({
        userId: userId,
      }).populate("userId");

      return { ...new MyPointSummaryResource(myScore, type) };
    } else if (type === "2") {
      const myScore = await TrendingCreator.findOne({
        userId: userId,
      }).populate("userId");

      return { ...new MyPointSummaryResource(myScore, type) };
    } else if (type === "3") {
      const myScore = await TalentedIkon.findOne({
        userId: userId,
      }).populate("userId");

      return { ...new MyPointSummaryResource(myScore, type) };
    } else if (type === "4") {
    } else {
      throw new BadRequestException("Please enter correct type");
    }
  }
}

export default ikonBoardServices;
