import quizServices from "./quizServices";

class quizController {
  /**
   * @description: add quiz page
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async addQuizPage(req, res) {
    await quizServices.addQuizPage(req, res);
  }

  /**
   * @description : add quiz
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async addQuiz(req, res) {
    await quizServices.addQuiz(req.body, req.file, req, res);
  }
}

export default quizController;
