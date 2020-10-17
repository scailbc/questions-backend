# Authentication

There are 3 basic types of authentication:

- cookies: only valid for web browser, it generate a cookie that stores the informations
- token: generate a to send in every request with the `Authorization` header, there are 2 ways
    - [Json Web Token JWT](https://jwt.io/): the token is not stores by the server, it is decoded by the server and contains all the informations for the authentication. The server doesn't store the tokens, so it's easier to configure, but a token can't be revoked until it expires and it contains sensible data of the user
    - the token is stored in a database (usually a fast database like [Redis](https://redis.io/)) and it's associated to a user. It's just a unique random string that doesn't contains any sensible data and it can be revoked

A famous library for authetication is [Passport](www.passportjs.org).

## Generate an authenticated session

To generate a session, we simply assign a unique identifier to a user that successfully login to the app.

The identifier will be sent in every request and will prove the uder identity without sending credentials.

### Cookies

To use cookies authentication:

```js
// index.js
const express = require("express");
const session = require("express-session"); // handle session authentication
const MongoStore = require("connect-mongo")(session); // store session on MongoDB

const app = express();

// Define middlewares

app.use(session({
    secret: config.AUTHENTICATION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true, // save the session every time, even if it wasn't modified
    rolling: true, // reset expiration date on every request
    saveUninitialized: true, // if the request has no cookie, generate one
    cookie: {
        sameSite: "none",
        secure: true,
        maxAge: 3 * 3600 * 1000, // expire after 3 hours of inactivity
    },
}));

let server;
if (config.ENABLE_HTTPS) {
    server = https.createServer({
        key: fs.readFileSync(path.resolve(__dirname, "..", "common", "sslcert", environment, "server.key")),
        cert: fs.readFileSync(path.resolve(__dirname, "..", "common", "sslcert", environment, "server.cert")),
    }, app).listen(port, () => {
        logger.log("backend", config.LOG.SYSTEM, "info", i18next.t('app_listening', {port}))
    });
} else {
    server = app.listen(port, function () {
        logger.log("backend", config.LOG.SYSTEM, "info", i18next.t('app_listening', {port}))
    });
}
```

```js
// Authentication middleware
const i18next = require("i18next");

module.exports = function ( req, res, next ) {
    req.sessionStore.get(req.session.id, (error, storedCookie) => {
        if(storedCookie) {
            if(req.session.username)
            {
                next();
            }else{
                req.session.destroy(() => {
                    res.status(403).send({error: i18next.t("errors.user_unauthorized")});
                });
            }
        }
        else {
            req.session.destroy(() => {
                res.status(401).send({
                    error: "Invalid cookie",
                });
            });
        }
    });
};
```

Note that we the latest security policies of most common browsers (Google Chrome v84), to authenticate on a server which resides on a different url, you need to set the `SameSite` flag to `none`, and to do that you need to set the `secure` flag to `true`, and to do that you need to communicate over https.

### JWT

We use the library [auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) to generate a valid JWT token.

The token is stored in the `authorization` header in the format `Authorization: <type> <credentials>`. The `type` is _Bearer_, which means that the credentials is an opaque string, not intended to have any meaning to clients using it,

```js
const jwt = require("jsonwebtoken");
const config = require("../../common/config");

module.exports = {
    saveUserInJWT: function (req, sonpm_response) {
        let sess = req.session;
        let token = jwt.sign({
            username: req.body.username,
        }, config.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        sess.jwt = token;
    },
    generateRefreshToken: function (jwtToken) {
        let token = jwt.sign({
            jwtToken : jwtToken
        }, config.SECRET, {
            expiresIn: config.86400 // expires in 24 hours
        });
        return token;
    },
    login: function(req) {
        let username = req.body.username;
        let password = req.body.password;

        return new Promise((resolve, reject)=>{
            // Check if credentials are valid
            if(userProfile) {
                this.saveUserInJWT(req, userProfile);
                const jwtToken = req.session.jwt;
                resolve(jwtToken);
                return;
            }
            else {
                // Invalid credentials
                resolve();
            }
        });
    },
    logout: function (req) {
        delete req.session.jwt;
    },
} 
```

```js
// Authentication middleware
const jwt = require("jsonwebtoken");
const config = require("../../../common/config");

module.exports = function (request, res, next) {

    if (!request || !request.headers.authorization || !request.headers.authorization.startsWith("Bearer ")) {
        res.status(401).send({
            success: false,
            message: "Json Web Token not found",
        });
        next("route");
    } 
    else {
        const jwtToken = request.headers.authorization.split(" ")[1];
        const refreshToken = request.headers['X-Refresh-Token'];
        jwt.verify(jwtToken, config.SECRET, (err, decoded) => {
            if (err) {             
                res.status(401).send({
                    success: false,
                    message: `Failed to authenticate token. ${err}`,
                });
                next("route");
            } else {
                // It's a valid JWT token, user is authenticated
                next();
            }
        });
    }
}
```

### Stored token

A stored token must be stored in the database and will be retrieved in every request to authenticate the user.

Since it's a value read in every request, it can be stored on a database like [Redis](https://redis.io/)), which is a key-value database simple and fast.

## Authenticate all requests

To require authentication for a route, we simply assign a middleware to the route.

```js
const authentication = require("./middlewares/authentication");
router.get(["/users"], authentication, function (req, res, next) {
```

The middleware check if there is a token in the request and if the token is valid.

If the token is not valid the request is interrupted.
