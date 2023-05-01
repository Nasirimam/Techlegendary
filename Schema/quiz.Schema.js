const mongoose = require("mongoose");

// This is Schema for Quiz
const quizSchema = mongoose.Schema({
  question: String,
  option: [String],
  rightAnswer: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["inactive", "active", "finished"],
    default: "inactive",
  },
});

// This function Change the status automatically
quizSchema.pre("save", function (next) {
  const now = Date.now();
  if (this.startDate > now) {
    this.status = "inactive";
  } else if (this.endDate < now) {
    this.status = "finished";
  } else {
    this.status = "active";
  }
  next();
});

module.exports = {
  quizSchema,
};
