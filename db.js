const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://nasir:imam@cluster0.k7pgqks.mongodb.net/quiz?retryWrites=true&w=majority"
);

module.exports = {
  connection,
};
