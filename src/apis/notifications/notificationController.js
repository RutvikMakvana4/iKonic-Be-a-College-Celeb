import notificationServices from "./notificationServices";

class notificationController {

    /**
     * @description: Notification history
     * @param {*} req 
     * @param {*} res 
     */
    static async notificationHistory(req, res) {
        const { data, meta } = await notificationServices.notificationHistory(req.user, req.query, req, res);
        return res.send({ data: data.notifications, meta: meta });
    }


    /**
     * @description: Unread notification count
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async unReadNotificationCount(req, res) {
        const data = await notificationServices.unReadNotificationCount(req.user, req, res);
        return res.send({ data: { notificationCount: data } });
    }


    /**
     * @description: Notification read at
     * @param {*} req 
     * @param {*} res 
     */
    static async notificationReadAt(req, res) {
        await notificationServices.notificationReadAt(req.params.id, req, res);
        return res.send({ message: "success" })
    }

}

export default notificationController;