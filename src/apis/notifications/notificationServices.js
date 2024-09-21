import mongoose from "mongoose";
import Notification from "../../../model/notifications";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import NotificationListResource from "./resources/notificationListResource";

class notificationServices {

    /**
     * @description: Notification history
     * @param {*} auth 
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async notificationHistory(auth, query, req, res) {
        try {
            const page = parseInt(query.page) - 1 || 0;
            const pageLimit = parseInt(query.limit) || 20;

            const findNotifications = await Notification.find({ userId: auth }).skip(page * pageLimit).limit(pageLimit).sort({ createdAt: -1 }).populate("friendId")

            const meta = {
                total: findNotifications.length,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(findNotifications.length / pageLimit)
            }

            return { data: new NotificationListResource(findNotifications), meta }
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * @description: Unread Notification count
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async unReadNotificationCount(auth, req, res) {
        const totalDocument = await Notification.countDocuments({ userId: auth, readAt: false });
        return totalDocument;
    }


    /**
     * @description: Notification read at
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     */
    static async notificationReadAt(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findNotificationId = await Notification.findById({ _id: id });
            if (findNotificationId) {
                await Notification.findByIdAndUpdate({ _id: findNotificationId._id }, {
                    readAt: true
                }, { new: true })
            } else {
                throw new NotFoundException("This notification id not found")
            }
        } else {
            throw new BadRequestException("Please provide correct notification id")
        }
    }

}

export default notificationServices;