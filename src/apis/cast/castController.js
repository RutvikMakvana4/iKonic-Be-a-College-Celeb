import castServices from "./castServices";

class castController {

    /**
     * @description: Create cast
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async createCast(req, res) {
        await castServices.createCast(req.body, req.user, req.files, req, res);
        return res.send({ message: "Your cast has been uploaded successfully." });
    }

    /**
    * @description: Delete cast
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    static async deleteCast(req, res) {
        await castServices.deleteCast(req.params.id, req.user, req, res);
        return res.send({ message: "Your cast has been deleted successfully." });
    }

    /**
    * @description: View cast
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    static async viewCast(req, res) {
        const data = await castServices.viewCast(req.params.id, req.user, req, res);
        return res.send({ data: data });
    }

    /**
    * @description: Edit cast
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    static async editCast(req, res) {
        const data = await castServices.editCast(req.params.id, req.body, req.user, req, res);
        return res.send({ data: data });
    }
}

export default castController;