import tuneInServices from "./tuneInServices";

class tuneInController {
  /**
   * @description: Tune In
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async tuneIn(req, res) {
    await tuneInServices.tuneIn(req.body, req.user, req, res);
    return res.send({ message: "Your Tune In has been cast successfully." });
  }

  /**
   * @description: My Tune In
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async myTuneIn(req, res) {
    const data = await tuneInServices.myTuneIn(req.user, req, res);
    return res.send({ data: data });
  }

  /**
   * @description: My Tune In Views
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async myTuneInViews(req, res) {
    const { data, meta } = await tuneInServices.myTuneInViews(
      req.query,
      req.user,
      req,
      res
    );
    return res.send({ data: data.viewers, meta: meta });
  }

  /**
   * @description: Unlock this profile
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async unlockProfile(req, res) {
    await tuneInServices.unlockProfile(req.params.id, req.user, req, res);
    return res.send({ message: "This profile is unlock successfully." });
  }

  /**
   * @description: Tune In Listing
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async tuneInList(req, res) {
    const { data, meta } = await tuneInServices.tuneInList(
      req.query,
      req.user,
      req,
      res
    );
    return res.send({ data: data, meta: meta });
  }

  /**
   * @description: View friends tune in
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async viewFriendTuneIn(req, res) {
    const data = await tuneInServices.viewFriendTuneIn(
      req.params.id,
      req.user,
      req,
      res
    );
    return res.send({ data: data });
  }

  /**
   * @description: View Tune In
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async viewTuneIn(req, res) {
    const data = await tuneInServices.viewTuneIn(
      req.params.id,
      req.user,
      req,
      res
    );
    return res.send({ message: "Your acceptance has been sent anonymously." });
  }

  /**
   * @description: Delete Tune In
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async deleteTuneIn(req, res) {
    const data = await tuneInServices.deleteTuneIn(
      req.params.id,
      req.user,
      req,
      res
    );
    return res.send({ message: "Your Tune In has been deleted successfully." });
  }

  /**
   * @description: Calculate total students count around 15 miles
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async totalStudents(req, res) {
    const data = await tuneInServices.totalStudents(
      req.user,
      req,
      res
    );
    return res.send({ data: data.friends });
  }
}

export default tuneInController;
