import otherServices from "./otherServices";

class otherController {

    /**
     * @description: Report issues
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async reportIssues(req, res) {
        await otherServices.reportIssues(req.body, req.user, req, res);
        return res.send({ message: "Your report issue has been submitted successfully" });
    }

    /**
     * @description: FeedBack
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async feedback(req, res) {
        await otherServices.feedback(req.body, req.user, req, res);
        return res.send({ message: "Thank you for feedback! Your feedback is valuable to us" });
    }

    /**
     * @description: FeedBack
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async privacyAndSecurity(req, res) {
        const data = await otherServices.privacyAndSecurity(req.body, req.user, req, res);
        return res.send({ data });
    }

    /**
     * @description: Remove user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteAccount(req, res) {
        await otherServices.deleteAccount(req.user, req, res);
        return res.send({ message: "User account deleted successfully." });
    }
}

export default otherController;