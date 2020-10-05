const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const path = require("path");

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.json({type: "application/json"}));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Helmet security header
app.use(helmet());

app.use(session({
    secret: "my-authentication-secret",
    resave: false,
    saveUninitialized: false
}));

const server = app.listen(port, function () {
    console.log("app_listening", port);
});