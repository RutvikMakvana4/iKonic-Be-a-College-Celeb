import admin from "firebase-admin";
import { BadRequestException } from "../common/exceptions/errorException";

class FcmHelper {

    /**
     * @description: Send push notification
     * @param {*} tokens
     * @param {*} payload
     */
    static async sendPushNotification(tokens, payload) {
        try {
             tokens = tokens.filter(
               (value, index, array) => array.indexOf(value) === index
            );
            console.log("toekns", tokens);
            if (tokens.length > 0) {
                const messaging = admin.messaging();
                const fcmMessages = [];

                tokens.map((token) => {
                    fcmMessages.push({
                        token: token,
                        apns: {
                            payload: {
                                aps: {
                                    alert: payload.notification,
                                },
                            },
                        },
                        data: payload.data,
                        notification: payload.notification,
                    });
                });

                messaging.sendEach(fcmMessages).then((result) => {
                    console.log(result.responses);
                });
            }
        } catch (err) {
            throw new BadRequestException(err)
        }
    }
}


export default FcmHelper;