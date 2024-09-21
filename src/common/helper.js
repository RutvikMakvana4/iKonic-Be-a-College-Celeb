import { baseUrl } from "../../src/common/constants/configConstants";
import FcmStore from "../../model/fcmToken";
import Notification from "../../model/notifications";
import FcmHelper from "./fcmHelper";
import UserDetails from "../../model/userDetails";
import path from "path";
import fs from "fs";
import PrivacySecurity from "../../model/privacyAndSecurity";
import Trendz from "../../model/trendz";

/**
 * @description : generate random string for given length
 * @param {number} length : length of random string to be generated (default 75)
 * @return {number} : generated random string
 */
export const randomStringGenerator = (givenLength = 75) => {
  const characters =
    givenLength > 10
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = givenLength;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomStrGen = Math.floor(Math.random() * characters.length);
    randomString += characters[randomStrGen];
  }
  return randomString;
};

/**
 * @description : generate random number for given length
 * @param {number} length : length of random number to be generated (default 75)
 * @return {number} : generated random number
 */
export const randomNumberGenerator = (givenLength = 5) => {
  const characters = "123456789";
  const length = givenLength;
  let randomNumber = "";

  for (let i = 0; i < length; i++) {
    const randomNumGen = Math.floor(Math.random() * characters.length);
    randomNumber += characters[randomNumGen];
  }
  return randomNumber;
};

/**
 * @description: logo url
 * @returns logo url
 */
export const logo = () => {
  return baseUrl("/logo/ikonic_logo.png");
};

/**
 * @description : Create dummy notification log
 * @param {*} userId
 * @param {*} friendId
 * @param {*} title
 * @param {*} description
 * @returns
 */
export const createNotificationLog = (userId, friendId, description) => {
  return Notification.create({
    userId: userId,
    friendId: friendId,
    description: description,
  });
};

/**
 * @description: Send user action notification
 * @param {*} status
 * @param {*} auth
 * @param {*} friendId
 * @param {*} userName
 */

export const sendUserActionNotification = async (notificationData) => {
  console.log(notificationData, "nData");
  try {
    const tokens = [];
    (await FcmStore.find({ userId: notificationData.auth })).forEach(function (
      document
    ) {
      tokens.push(document.token);
    });

    let payload = {
      notification: {
        title: "",
        body: "",
      },
      data: {
        logo: baseUrl("/logo/ikonic_logo.png"),
        ...notificationData,
      },
    };

    console.log(payload, "payload");

    let status = notificationData.status;
    let userName = notificationData.userName;

    if (status === "1") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `${userName} started following you.`);
    } else if (status === "2") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `${userName} liked your cast`);
    } else if (status === "3") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `${userName} commented on your cast.`);
    } else if (status === "4") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `Someone has secretly admired you`);
    } else if (status === "5") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `${userName} rated your Creativity cast.`);
    } else if (status === "6") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `${userName} tagged you on Thank You cast.`);
    } else if (status === "7") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `${userName} tagged you on Shout Out cast.`);
    } else if (status === "8") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `${userName} requested to follow you.`);
    } else if (status === "9") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `Your cast is nominated for Trendz`);
    } else if (status === "10") {
      (payload.notification.title = `iKonic`),
        (payload.notification.body = `${userName} accepted your request`);
    } else {
      return;
    }

    const createNotification = await Notification.create({
      userId: notificationData.auth,
      status: notificationData.status,
      type: notificationData.type,
      title: payload.notification.title,
      description: payload.notification.body,
      friendId: notificationData.friendId,
      castId: notificationData.castId ? notificationData.castId : null,
    });

    payload.data.notificationId = createNotification._id.toString();

    console.log(payload, "finalpayload");

    const findNotificationSetting = await PrivacySecurity.findOne({
      userId: notificationData.auth,
    });
    const manageNotification = findNotificationSetting.manageNotifications;

    if (manageNotification === true) {
      await FcmHelper.sendPushNotification(tokens, payload);
    }
  } catch (error) {
    console.log(error);
  }
};

export const storeUserDeatils = async (type, userId, friendId) => {
  if (type === 1) {
    await UserDetails.create({
      type: 1,
      userId: userId,
      friendId: friendId,
    });
  } else if (type === 2) {
    await UserDetails.create({
      type: 2,
      userId: userId,
      friendId: friendId,
    });
  } else if (type === 3) {
    await UserDetails.create({
      type: 3,
      userId: userId,
      friendId: friendId,
    });
  } else if (type === 4) {
    await UserDetails.create({
      type: 4,
      userId: userId,
      friendId: friendId,
    });
  }
};

/**
 * unlinkFile : remove files from folder
 * @param filename : file name store in database
 * @return { boolean } : true/false
 */
export const unlinkFile = async (filename) => {
  const img = path.join(`${__dirname}` + `../../../${filename}`);

  if (fs.existsSync(img)) {
    try {
      fs.unlinkSync(img);
      return true;
    } catch (error) {
      console.error("Error while deleting the file:", error);
    }
  }
};

/**
 * updateTrendz : calculate all trendz cast and their likes
 * @param castId : cast id
 * @param userId: user id
 * @return { boolean } : true/false
 */
export const updateTrendz = async (cast, userId) => {
  const { _id: castId, userId: castUserId, likes, isNominateForTrendz } = cast;

  const totalLikesCount = likes.length;

  // Check if the cast meets the conditions for being nominated for Trendz
  const shouldNominateForTrendz = isNominateForTrendz && totalLikesCount > 1;

  // Calculate total score
  const totalScore = shouldNominateForTrendz
    ? totalLikesCount * totalLikesCount
    : 0;

  // Find if the creator is already in Trendz
  const existingTrendzEntry = await Trendz.findOne({ userId: castUserId });

  if (shouldNominateForTrendz) {
    // If the cast meets the conditions for being nominated for Trendz

    if (!existingTrendzEntry) {
      // If the creator is not in Trendz, create a new entry
      await Trendz.create({ userId: castUserId, castId });
    } else {
      // If the creator is already in Trendz, update the entry
      await Trendz.findByIdAndUpdate(existingTrendzEntry._id, {
        $set: { castId },
        $inc: { totalScore, totalCasts: 1, totalLikes: totalLikesCount },
      });
    }
  } else {
    // If the cast does not meet the conditions for being nominated for Trendz
    if (existingTrendzEntry) {
      // If the creator is in Trendz, remove the cast entry
      await Trendz.findByIdAndDelete(existingTrendzEntry._id);
    }
  }
};

/**
 * Send notification to the single user
 * @param {*} userId
 * @param {*} notificationPayload
 * @param {*} dataPayload
 */
export const sendNotificationToSingleUser = async (
  userId,
  notificationPayload
) => {
  const tokens = [];
  (await FcmStore.find({ userId: userId })).forEach(function (document) {
    tokens.push(document.token);
  });

  const findNotificationSetting = await PrivacySecurity.findOne({
    userId: userId,
  });
  const manageNotification = findNotificationSetting.manageNotifications;

  if (manageNotification === true) {
    await FcmHelper.sendPushNotification(tokens, notificationPayload);
  }
};
