import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import session from "express-session";
import flash from "connect-flash";
import { JWT } from "./src/common/constants/constants";
import "./src/common/config/dbConnection";
import "./src/common/config/jwtPassport";

import mainRouter from "./routers/index";
import swaggerSetup from "./src/common/swagger";

import "./seeders/interestSeeder";
import "./seeders/subCultureSeeder";
import "./seeders/castMessageSeeder";
import "./seeders/adminSeeder";

import "./cron-job/index";
import "./cron-job/ikonBoard";
import "./src/common/config/fcmConfig";

const app = express();

import { createServer } from "http";
import io from "./src/chat/chat-connection";
import { func } from "joi";

const http = createServer(app);

const PORT = process.env.PORT || 7004;

//********************************************************************************* */

//********************************************************************************* */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false, limit: "52428800" }));
app.use(express.json({ limit: "52428800" }));

app.use(
  session({
    name: "iKonic-Social-Media-App",
    secret: JWT.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Flash message
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(swaggerSetup);
app.use(mainRouter);

app.use(express.static(path.join(__dirname + "/public")));
app.use(require("./src/common/middleware/error"));

const isSecure = process.env.IS_SECURE === "true";
const port = isSecure ? process.env.PORT : process.env.PORT;

if (isSecure) {
  var options = {
    key: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/privkey.pem`),
    cert: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
    ca: [
      fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
      fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/fullchain.pem`),
    ],
  };
  var https = require("https").Server(options, app);

  io.attach(https);

  https.listen(port, () => {
    console.log(
      `Https server is running on https://${process.env.HOST}:${PORT}`
    );
  });
} else {
  io.attach(http);

  http.listen(PORT, (err) => {
    if (err) throw new console.log("Server not connect");
    console.log(`Server is running on http://${process.env.HOST}:${PORT}`);
  });
}
