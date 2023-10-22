const express = require("express");
const { port, mongoURL } = require("./db.js");
const mongoose = require("mongoose");
// const authRoutes = require("./routes/auth");

const app = express();

//Available routes;
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (request, response) => {
  return response.send("Hello World!!");
});

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });
