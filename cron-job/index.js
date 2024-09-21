import cron from "node-cron";
import TuneIn from "../model/tuneIn";
import TuneInViewer from "../model/tuneInViewer";
import moment from "moment";

console.log("cron job start");

cron.schedule("* * * * *", async () => {
  // console.log(
  //   "cron job run every minutes",
  //   new Date(moment().subtract("6", "hours"))
  // );

  await TuneIn.deleteMany({
    createdAt: {
      $lte: new Date(moment().subtract("6", "hours")),
    },
  });

  await TuneInViewer.deleteMany({
    createdAt: {
      $lte: new Date(moment().subtract("6", "hours")),
    },
  });
});