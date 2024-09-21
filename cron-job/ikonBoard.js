import cron from "node-cron";
import moment from "moment";
import PopularIkon from "../model/popularIkon";
import TalentedIkon from "../model/talentedIkon";
import TrendingCreator from "../model/trendingCreator";

// console.log("cron job start");

cron.schedule("0 0 * * *", async () => {
  console.log("ikon board refresh every 24 hours");

  const popularIkons = await PopularIkon.find({});

  for (const ikon of popularIkons) {
    ikon.diff = ikon.totalScore - ikon.oldScore;
    const oldScore = ikon.totalScore;
    ikon.oldScore = oldScore;

    await ikon.save();
  }

  const trendingCreator = await TrendingCreator.find({});

  for (const ikon of trendingCreator) {
    ikon.diff = ikon.totalScore - ikon.oldScore;
    const oldScore = ikon.totalScore;
    ikon.oldScore = oldScore;

    await ikon.save();
  }

  const talentedIkon = await TalentedIkon.find({});

  for (const ikon of talentedIkon) {
    ikon.diff = ikon.totalScore - ikon.oldScore;
    const oldScore = ikon.totalScore;
    ikon.oldScore = oldScore;

    await ikon.save();
  }
});
