const mongoose = require("mongoose");

mongoose
  .connect('mongodb://localhost:27017/verover', {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error in database connection", err.message));
