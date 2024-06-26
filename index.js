const express = require("express");
var cors = require("cors");
const { port, mongoURL } = require("./db.js");
const mongoose = require("mongoose");
const app = express();

app.use(cors());

app.use(express.json());

//Available routes;
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (request, response) => {
  return response.send("npm run dev");
});

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(port, () => {
      console.log(`MyNoteBook is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });
