import authServices from "./authServices";

class authController {

    /**
     * @description: OTP Verification
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async otpVerification(req, res) {
        const data = await authServices.otpVerification(req.body, req, res);
        return res.send({ message: "OTP verify successfully", data: data });
    }

    /**
     * @description: Update Phone OTP Verification
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async updatePhoneOtpVerification(req, res) {
        const data = await authServices.updatePhoneOtpVerification(req.body, req.user, req, res);
        return res.send({ message: "OTP verify successfully", data });
    }

    /**
     * @description: Resend OTP
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async resendOTP(req, res) {
        const data = await authServices.resendOTP(req.body, req, res);
        return res.send({ message: "Resend otp to your phone number" });
    }

    /**
     * @description: User Registration
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async register(req, res) {
        const data = await authServices.register(req.body, req, res);
        return res.send({ message: "User Register successfully", data });
    }

    /**
     * @description: User Login
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async login(req, res) {
        const data = await authServices.login(req.body, req, res);
        return res.send({ message: "User login successfully", data });
    }

    /**
     * @description: Logout user
     * @param {*} req 
     * @param {*} res 
     */
    static async logout(req, res) {
        await authServices.logout(req.body, req, res);
        return res.send({ message: "Logged out successfully" });
    }


    /**
     * @description : generate new Access token
     * @param {*} req
     * @param {*} res 
     */
    static async newAccessToken(req, res) {
        const data = await authServices.newAccessToken(req.body, req, res)
        return res.send({ data })
    }

    /**
     * @description : Intrests list
     * @param {*} req
     * @param {*} res 
     */
    static async interestList(req, res) {
        const data = await authServices.interestList(req, res)
        return res.send({ data })
    }

    /**
     * @description : Sub-Cultures list
     * @param {*} req
     * @param {*} res 
     */
    static async subCultureList(req, res) {
        const data = await authServices.subCultureList(req, res)
        return res.send({ data })
    }

    /**
     * @description : Cast messages list
     * @param {*} req
     * @param {*} res 
     */
    static async castMessageList(req, res) {
        const data = await authServices.castMessageList(req.query, req, res)
        return res.send({ data })
    }
}

export default authController;