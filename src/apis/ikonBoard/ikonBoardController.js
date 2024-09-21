import ikonBoardServices from "./ikonBoardServices";

class ikonBoardController {

    /**
     * @description : User ikon details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async userIkonDetails(req, res) {
        const data = await ikonBoardServices.userIkonDetails(req.query, req.user, req, res);
        return res.send({ data: data });
    }

    /**
     * @description : User points summary
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async userPointSummary(req, res) {
        const data = await ikonBoardServices.userPointSummary(req.query, req.user, req, res);
        return res.send({ data: data });
    }

}

export default ikonBoardController;