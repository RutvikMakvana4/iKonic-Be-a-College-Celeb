import chatServices from "./chatServices";

class chatController {
  /**
   * @description: Chat Friend list
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async chatFriendList(req, res) {
    const { data, meta } = await chatServices.chatFriendList(
      req.query,
      req.user,
      req,
      res
    );
    return res.send({ data: data.friends, meta: meta });
  }

  /**
   * @description: Chat messages history
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async messageHistory(req, res) {
    const { data, meta } = await chatServices.messageHistory(
      req.query,
      req.user,
      req,
      res
    );
    return res.send({ data: data.messages, meta: meta });
  }
}

export default chatController;
