const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const path = require("path");

const apiRoutes = require("./src/routes");

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

// Connection with database is managed in src/dbConnection.js

// routes setup
app.use("/", apiRoutes);

const server = app.listen(port, function () {
    console.log("app_listening", port);
});