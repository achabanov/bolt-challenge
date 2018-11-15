var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public/dist/public"));

app.set("views", __dirname + "/views");

app.set("view engine", "ejs");

app.listen(8000, function () {
  console.log("listening on 8000");
});
