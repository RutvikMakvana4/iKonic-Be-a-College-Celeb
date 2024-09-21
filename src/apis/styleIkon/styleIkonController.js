import StyleIkonService from "./styleIkonService";
import intraClgParticipantsResource from "./resouce/intraClgParticipants.resource";

class StyleIkonController {
  /**
   * @description Participate in season
   * @param {*} req
   * @param {*} res
   */
  static async participate(req, res) {
    const data = await StyleIkonService.participate(req.user, req.files);
    return res.send({ message: data });
  }

  /**
   * @description like/dislike participant
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async likeDislike(req, res) {
    const data = await StyleIkonService.likeDislike(
      req.user,
      req.query.participantId
    );
    return res.send({ data: data });
  }

  /**
   * @description Intra Colllege Participants
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async intraClgParticipants(req, res) {
    const { data, meta } = await StyleIkonService.intraClgParticipants(
      req.user,
      req.query
    );
    return res.send({ data: new intraClgParticipantsResource(data), meta });
  }

  /**
   * @description National Round Participants
   * @param {*} req
   * @param {*} res
   */
  static async nationalParticipants(req, res) {
    const data = await StyleIkonService.nationalParticipants(
      req.user,
      req.query
    );
    return res.send({ data: data });
  }

  /**
   * @description Leading Universities List
   * @param {*} req
   * @param {*} res
   */
  static async leadingUniversities(req, res) {
    const data = await StyleIkonService.leadingUniversities();
    return res.send({ data: data });
  }
}

export default StyleIkonController;
