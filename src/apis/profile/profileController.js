import profileServices from "./profileServices";

class profileController {

    /**
     * @description : Search friends
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async searchFriends(req, res) {
        const { data, meta } = await profileServices.searchFriends(req.query, req.body, req.user, req, res);
        return res.send({ data: data.friends, meta: meta });
    }

    /**
     * @description: Follow Friend
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async followFriends(req, res) {
        await profileServices.followFriends(req.query, req.user, req, res);
    }

    /**
     * @description: Confirm follow request
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async confirmFollowRequest(req, res) {
        await profileServices.confirmFollowRequest(req.query, req.user, req, res);
    }

    /**
     * @description: Get followers list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getFollowers(req, res) {
        const data = await profileServices.getFollowers(req.params.id, req.user, req, res);
        return res.send({ data });
    }

    /**
     * @description: Secretly Admire
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async secretlyAdmire(req, res) {
        await profileServices.secretlyAdmire(req.params.id, req.user, req, res);
    }

    /**
     * @description: Suggested Friends
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async suggestedFriends(req, res) {
        const { data, meta } = await profileServices.suggestedFriends(req.query, req.user, req, res);
        return res.send({ data: data.friends, meta: meta });
    }
}

export default profileController;