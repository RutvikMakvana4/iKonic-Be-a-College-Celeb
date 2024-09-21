import trendServices from "./trendzServices";

class trendController {

    /**
     * @description: Trendz list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async trendz(req, res) {
        const { data, meta } = await trendServices.trendz(req.query, req.user, req, res);
        return res.send({ data: data.casts, meta: meta });
    }
}

export default trendController;