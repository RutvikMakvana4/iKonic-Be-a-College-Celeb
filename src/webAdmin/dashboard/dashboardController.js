import User from "../../../model/user";

class dashboardController {
  /**
   * @description: Dashboard
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async dashboard(req, res) {
    const users = await User.find({}).count();

    return res.render("webAdmin/dashboard", {
      users: users,
    });
  }
}

export default dashboardController;
