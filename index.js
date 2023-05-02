const express = require("express");
const { connection } = require("./db");
const { QuizModel } = require("./Models/quiz.Model");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");

const app = express();

//This will pay attention that rate Limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // maximum 10 requests per minute
  message: "Too many requests from this IP, please try again in a minute.",
});

app.use(express.json());
app.use(limiter);

// This is just Home Page For understanding
app.get("/", (req, res) => {
  res.send("This is Home Page");
});

//This Route Help To Post Quiz
app.post("/quizzes", async (req, res) => {
  const data = req.body;

  try {
    const quiz = new QuizModel(data);
    await quiz.save();
    console.log(quiz);
    res.send("Quiz is Added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error." });
  }
});

//This Function Get all active quiz
app.get("/quizzes/active", async (req, res) => {
  try {
    const now = Date.now();
    const activeQuizzes = await QuizModel.find({
      startDate: { $lt: now },
      endDate: { $gt: now },
    });
    if (!activeQuizzes || activeQuizzes.length === 0) {
      return res.status(404).json({ message: "No active quizzes found." });
    }
    res.json(activeQuizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error." });
  }
});

// This Function get All Quiz
app.get("/quizzes/all", async (req, res) => {
  try {
    const quizzes = await QuizModel.find();
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found." });
    }
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error." });
  }
});

// This Help to Start the change the active status on time automatic
cron.schedule("* * * * *", async () => {
  try {
    const now = Date.now();
    const activeQuiz = await QuizModel.findOne({
      startDate: { $lt: now },
      endDate: { $gt: now },
      status: "inactive",
    });
    if (activeQuiz) {
      activeQuiz.status = "active";
      await activeQuiz.save();
      console.log(`Quiz ${activeQuiz._id} is now active.`);
    }

    const finishedQuiz = await QuizModel.findOne({
      endDate: { $lt: now },
      status: { $ne: "finished" },
    });
    if (finishedQuiz) {
      finishedQuiz.status = "finished";
      await finishedQuiz.save();
      console.log(`Quiz ${finishedQuiz._id} is now finished.`);
    }
  } catch (error) {
    console.error(error);
  }
});

// This function connect to Database
app.listen(4500, async () => {
  try {
    await connection;
    console.log("Connected To DB");
  } catch (error) {
    console.log(error);
    console.log("Error to Connect");
  }
  console.log(`server is running on port 4500`);
});
