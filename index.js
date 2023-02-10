require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dns = require("dns");
const Url = require("./models/url");
// Basic Configuration
const port = 3000;
const dbURI =
  "mongodb+srv://test-user:test1234@cluster0.gr6xp1u.mongodb.net/url-db?retryWrites=true&w=majority";
mongoose.set("strictQuery", true); //to supress the warning appeared
mongoose
  .connect(dbURI)
  .then((result) => console.log("connected to db"))
  .catch((err) => console.log(err));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
app.get("/api/shorturl/:url", (req, res) => {
  url = req.params.url;
  Url.findById(url).then((result) => {
    const fullUrl = "https://" + result.original_url;
    console.log(fullUrl);
    res.redirect(302, fullUrl);
  });
});
app.post("/api/shorturl", (req, res) => {
  //check if the url valid or not

  dns.lookup(req.body.url, (err, result) => {
    try {
      const urlValidate = new URL(req.body.url);
    } catch {
      res.json({ error: "invalid url" });
      return;
    }

    console.log("valid url", result);
    Url.findOne({ original_url: req.body.url }, (err, result) => {
      if (err) console.log(err);
      else if (result) {
        console.log("found");
        res.json({
          original_url: result.original_url,
          short_url: result._id,
        });
      } else {
        console.log("not found");
        const url = new Url({ original_url: req.body.url });
        url
          .save()
          .then((result) => {
            console.log("saved to db");
            //send ans
            res.json({
              original_url: result.original_url,
              short_url: result._id,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
});
