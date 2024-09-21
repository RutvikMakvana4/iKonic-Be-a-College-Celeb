import buzzServices from "./buzzServices";

class buzzController {

    /**
     * @description: Buzz landing page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async buzzLandingPage(req, res) {
        const { data, meta } = await buzzServices.buzzLandingPage(req.query, req.user, req, res);
        return res.send({ data: data.casts, meta: meta });
    }

    /**
     * @description: Like cast
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async likeCast(req, res) {
        const data = await buzzServices.likeCast(req.params.id, req.user, req, res);
        return res.send({ data: data });
    }

    /**
     * @description: comments in cast
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async commentCast(req, res) {
        const data = await buzzServices.commentCast(req.body, req.params.id, req.user, req, res);
        return res.send({ data });
    }

    /**
     * @description: Comment listing for one cast
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async commentListing(req, res) {
        const { data, meta } = await buzzServices.commentListing(req.query, req.user, req, res);
        return res.send({ data: data.comments, meta: meta });
    }

    /**
     * @description: Comment listing for one cast
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async ratingCast(req, res) {
        const data = await buzzServices.ratingCast(req.body, req.params.id, req.user, req, res);
        return res.send({ data: data });
    }

    /**
     * @description: Share cast
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async searchFollowers(req, res) {
        const { data, meta } = await buzzServices.searchFollowers(req.query, req.user, req, res);
        return res.send({ data: data.friends, meta: meta });
    }

    /**
     * @description: Share cast
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async shareCast(req, res) {
        await buzzServices.shareCast(req.body, req.query, req.user, req, res);
        return res.send({ message: "Cast share successfully." });
    }

    /**
     * @description: View cast
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async viewCast(req, res) {
        const data = await buzzServices.viewCast(req.params.id, req.user, req, res);
        return res.send({ data: data });
    }
}

export default buzzController;