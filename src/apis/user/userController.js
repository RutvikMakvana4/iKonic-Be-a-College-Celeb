import { MetricPage } from "twilio/lib/rest/insights/v1/call/metric";
import userServices from "./userServices";

class userController {

    /**
     * @description: Get searching organizations list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async organizationListing(req, res) {
        const { data, meta } = await userServices.organizationListing(req.query, req.user, req, res);
        return res.send({ data: data, meta: meta });
    }

    /**
     * @description: Get user data
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getUser(req, res) {
        const data = await userServices.getUser(req.user, req.body, req.file, req, res);
        return res.send({ data });
    }

    /**
     * @description: Update user data
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async updateUser(req, res) {
        const data = await userServices.updateUser(req.user, req.body, req.file, req, res);
        return res.send({ data })
    }

    /**
     * @description: Edit Profile
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async editProfile(req, res) {
        const data = await userServices.editProfile(req.user, req.body, req.file, req, res);
        return res.send({ message: "Edit profile successfully", data: data });
    }

    /**
     * @description: Update phone number
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async updatePhoneNumber(req, res) {
        await userServices.updatePhoneNumber(req.body, req.user, req, res);
        return res.send({ message: "Send otp to your phone number" });
    }

    /**
     * @description: Get user profile details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getUserProfileDetails(req, res) {
        const data = await userServices.getUserProfileDetails(req.query, req.user, req, res);
        return res.send({ data });
    }


    /**
     * @description: Get user memory lane
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async userMemoryLane(req, res) {
        const { data, meta } = await userServices.userMemoryLane(req.query, req.user, req, res);
        return res.send({ data: data.memoryLane, meta: meta });
    }

    /**
     * @description: Get memorylane all images month vise
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getMemoryLaneMonthImage(req, res) {
        const { data, meta } = await userServices.getMemoryLaneMonthImage(req.query, req.user, req, res);
        return res.send({ data: data.memoryLane, meta: meta });
    }


    /**
     * @description : Profile picture view
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async userProfilePicView(req, res) {
        const data = await userServices.userProfilePicView(req.query, req.user, req, res);
        return res.send({ data })
    }

    /**
     * @description: Get followers list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getUsersFollowers(req, res) {
        const { data, meta } = await userServices.getUsersFollowers(req.query, req.user, req, res);
        return res.send({ data: data.userDetails, meta: meta });
    }

    /**
     * @description: Remove user follower
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async removeFollower(req, res) {
        await userServices.removeFollower(req.params.id, req.user, req, res);
        return res.send({ message: "Remove follower successfully" });
    }

    /**
     * @description: Block user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async blockUser(req, res) {
        await userServices.blockUser(req.query, req.user, req, res);
    }

    /**
     * @description: Block user listing
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async blockUserList(req, res) {
        const { data, meta } = await userServices.blockUserList(req.query, req.user, req, res);
        return res.send({ data: data.userDetails, meta: meta });
    }
}

export default userController;