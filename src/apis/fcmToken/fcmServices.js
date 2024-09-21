import FcmStore from "../../../model/fcmToken";
import FcmHelper from "../../common/fcmHelper";

class fcmServices {
  /**
   * @description : Register FCM Token
   * @param {*} auth
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async fcmRegister(auth, data, req, res) {
    const { token, deviceId, deviceType } = data;

    console.log("in fcm ", data);

    const fcmToken = await FcmStore.deleteMany({
      token,
    });

    await FcmStore.create({
      token,
      deviceId,
      userId: auth,
      deviceType,
    });
    // if (!fcmToken) {
    //   console.log("in token already exist", fcmToken);
    //   await FcmStore.create({
    //     token,
    //     deviceId,
    //     userId: auth,
    //     deviceType,
    //   });
    // } else {
    //   console.log("in token not exist", fcmToken);
    //   await FcmStore.updateOne(
    //     { userId: auth, deviceId },
    //     {
    //       token,
    //       deviceId,
    //     }
    //   );
    // }
    return;
  }

  /**
   * @description : Testing (send notification)
   * @param {*} auth
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async sendPush(data, req, res) {
    const { token, title, message, deviceId } = data;
    const tokens = [token];

    const payload = {
      notification: {
        title: title,
        body: message,
      },
      data: {
        deviceId: deviceId,
        type: deviceType,
      },
    };

    await FcmHelper.sendPushNotification(tokens, payload);
  }
}

export default fcmServices;
