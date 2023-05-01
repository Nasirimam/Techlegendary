const mongoose = require("mongoose");
const { quizSchema } = require("../Schema/quiz.Schema");

const QuizModel = mongoose.model("quiz", quizSchema);

module.exports = {
  QuizModel,
};
