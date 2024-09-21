import Quiz from "../../../model/quiz";

class quizServices {
  /**
   * @description: add quiz page load
   * @param {*} req
   * @param {*} res
   */
  static async addQuizPage(req, res) {
    return res.render("webAdmin/quiz/quiz");
  }

  /**
   * @description: add quiz
   * @param {*} data
   * @param {*} file
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async addQuiz(data, file, req, res) {
    const quizImage = file ? `quizImages/${file.filename}` : null;

    var isCorrectIndex = data.isCorrect;

    var formattedOptions = data.options.map(function (option, index) {
      return {
        option: option,
        isCorrect: index === +isCorrectIndex,
      };
    });

    await Quiz.create({
      question: data.question,
      options: formattedOptions,
      image: quizImage,
    });

    return res.redirect("/webAdmin/dashboard");
  }
}

export default quizServices;
